import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { z } from 'zod';

import {
  type Permission,
  type Principal,
  type PublicUser,
  SESSION_COOKIE_NAME,
  errors,
  isAppError,
  parseOrThrow,
  requirePermission,
  resolveSession,
  toAppError,
} from '@ap/core';

import { authDeps, rateLimiter } from './deps';
import { clientIpFrom, hashIp, userAgentDigest } from './ip';
import { isProduction } from './env';

/**
 * Der einzige Weg, auf dem ein Route Handler eine Antwort erzeugt.
 *
 * Nach ADR-001 darf ein Handler genau vier Dinge tun: validieren,
 * authentifizieren, autorisieren, delegieren. Die ersten drei erledigt dieser
 * Wrapper, damit sie nicht in jedem Handler neu -- und irgendwann falsch --
 * geschrieben werden.
 */

/**
 * Zweites Argument, das Next.js jeder Route uebergibt. Bei Routen ohne
 * dynamische Segmente ist `params` ein leeres Objekt -- nicht undefined.
 */
export interface RouteContext {
  params: Promise<Record<string, string | string[]>>;
}

export interface ApiContext {
  request: NextRequest;
  principal: Principal | null;
  user: PublicUser | null;
  sessionId: string | null;
  ipHash: string | null;
  userAgentDigest: string | null;
  /** Liest den Body und validiert ihn. Ungueltiges wirft einen AppError. */
  body<TSchema extends z.ZodTypeAny>(schema: TSchema): Promise<z.infer<TSchema>>;
  /** Validiert die Query-Parameter. */
  query<TSchema extends z.ZodTypeAny>(schema: TSchema): z.infer<TSchema>;
  /** Validiert die Pfadparameter dynamischer Routen. */
  params<TSchema extends z.ZodTypeAny>(schema: TSchema): Promise<z.infer<TSchema>>;
  /**
   * Kennung der angemeldeten Person. Wirft, wenn keine Sitzung besteht.
   *
   * Gedacht fuer Routen mit `auth: 'required'`, bei denen der Wert ohnehin
   * garantiert ist. Der Umweg ueber `principal?.userId ?? ''` waere zwar
   * gleichwertig, macht aber aus einem spaeteren Fehler beim `auth`-Modus
   * einen Datensatz, der niemandem gehoert -- oder eine Abfrage nach den
   * Entwuerfen des Besitzers "".
   */
  userId(): string;
}

export interface RouteOptions {
  /** `required` erzwingt eine Sitzung, `optional` reicht sie nur durch. */
  auth?: 'required' | 'optional' | 'none';
  /** Zusaetzlich gefordertes Recht. Setzt `auth: required` voraus. */
  permission?: Permission;
  rateLimit?: {
    limit: number;
    windowSeconds: number;
    /** Zusatz zum Schluessel, damit sich Endpunkte nicht gegenseitig drosseln. */
    scope: string;
    /** Bei true zaehlt die angemeldete Person statt der IP-Adresse. */
    perUser?: boolean;
  };
}

type Handler = (context: ApiContext) => Promise<Response> | Response;

export function route(
  handler: Handler,
  options: RouteOptions = {},
): (request: NextRequest, routeContext: RouteContext) => Promise<Response> {
  const authMode = options.auth ?? (options.permission ? 'required' : 'none');

  return async function handleRequest(
    request: NextRequest,
    routeContext: RouteContext,
  ): Promise<Response> {
    try {
      const ip = clientIpFrom(request.headers);
      const ipHash = hashIp(ip);

      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value ?? null;
      const session =
        authMode === 'none' && !options.permission
          ? null
          : await resolveSession(authDeps, token);

      if (options.rateLimit) {
        const subject = options.rateLimit.perUser
          ? (session?.principal.userId ?? ip ?? 'anonym')
          : (ip ?? 'unbekannt');
        const decision = await rateLimiter.consume(
          `${options.rateLimit.scope}:${subject}`,
          options.rateLimit.limit,
          options.rateLimit.windowSeconds,
        );
        if (!decision.allowed) throw errors.rateLimited(decision.retryAfterSeconds);
      }

      if (authMode === 'required' && !session) throw errors.unauthenticated();
      if (options.permission) requirePermission(session?.principal ?? null, options.permission);

      const context: ApiContext = {
        request,
        principal: session?.principal ?? null,
        user: session?.user ?? null,
        sessionId: session?.sessionId ?? null,
        ipHash,
        userAgentDigest: userAgentDigest(request.headers),
        body: async (schema) => parseOrThrow(schema, await readJsonBody(request)),
        query: (schema) =>
          parseOrThrow(schema, Object.fromEntries(request.nextUrl.searchParams)),
        params: async (schema) => parseOrThrow(schema, (await routeContext?.params) ?? {}),
        userId: () => {
          const id = session?.principal.userId;
          if (!id) throw errors.unauthenticated();
          return id;
        },
      };

      return await handler(context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/** Erfolgsantwort mit einheitlicher Huelle. */
export function ok<T>(data: T, init?: ResponseInit): NextResponse {
  return NextResponse.json({ data }, { status: 200, ...init });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 }) as NextResponse;
}

/** Grenze fuer JSON-Bodies. Groesseres gehoert in einen Upload-Endpunkt. */
const MAX_BODY_BYTES = 256 * 1024;

async function readJsonBody(request: NextRequest): Promise<unknown> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw errors.validation({ _: ['Es wird ein JSON-Body erwartet.'] });
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (declaredLength > MAX_BODY_BYTES) {
    throw errors.validation({ _: ['Der Inhalt ist zu gross.'] });
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    throw errors.validation({ _: ['Der Inhalt ist zu gross.'] });
  }
  if (raw.trim().length === 0) return {};

  try {
    return JSON.parse(raw);
  } catch {
    throw errors.validation({ _: ['Der Inhalt ist kein gueltiges JSON.'] });
  }
}

function errorResponse(error: unknown): NextResponse {
  const appError = toAppError(error);

  // Serverfehler landen im Log, nicht in der Antwort.
  if (appError.status >= 500) {
    console.error('[api]', {
      code: appError.code,
      internal: appError.internal,
      cause: appError.cause instanceof Error ? appError.cause.stack : appError.cause,
    });
  } else if (!isProduction && !isAppError(error)) {
    console.warn('[api] unerwarteter Fehlertyp', error);
  }

  const headers = new Headers();
  if (appError.retryAfterSeconds !== undefined) {
    headers.set('Retry-After', String(appError.retryAfterSeconds));
  }

  return NextResponse.json(appError.toPublicJSON(), {
    status: appError.status,
    headers,
  });
}
