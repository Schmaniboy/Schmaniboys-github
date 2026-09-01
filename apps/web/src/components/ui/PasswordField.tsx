'use client';

import { useState, useId, type InputHTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

const CONTROL_CLASSES =
  'w-full rounded-md border border-line-interactive bg-surface-1 px-3 text-base sm:text-sm text-ink ' +
  'placeholder:text-ink-subtle transition-all duration-200 ' +
  'hover:border-ink-subtle disabled:cursor-not-allowed disabled:opacity-50 ' +
  'focus:border-accent focus:shadow-[0_0_0_3px_rgba(255,51,85,0.15)] focus:outline-none ' +
  'aria-[invalid=true]:border-critical aria-[invalid=true]:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]';

export interface PasswordFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: string;
  hint?: string;
  error?: string | undefined;
}

export function PasswordField({
  label,
  hint,
  error,
  className,
  ...props
}: PasswordFieldProps) {
  const id = useId();
  const [sichtbar, setSichtbar] = useState(false);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {props.required ? (
          <span className="text-accent" aria-hidden="true">
            {' *'}
          </span>
        ) : null}
      </label>

      <div className="relative">
        <input
          {...props}
          id={id}
          type={sichtbar ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={cn(CONTROL_CLASSES, 'h-11 pr-12', className)}
        />
        <button
          type="button"
          onClick={() => setSichtbar((v) => !v)}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent/30"
          aria-label={sichtbar ? 'Passwort verbergen' : 'Passwort anzeigen'}
          tabIndex={-1}
        >
          {sichtbar ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
