import Link from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Schaltflaechen und Schaltflaechen-Links.
 *
 * Wichtig ist die Trennung: Eine Schaltflaeche loest eine Handlung aus, ein
 * Link fuehrt woanders hin. Ein <button> in einem <a> ist ungueltiges HTML und
 * fuer Hilfstechnik mehrdeutig -- deshalb gibt es hier zwei Bauteile mit
 * derselben Optik statt einer Verschachtelung.
 *
 * `primary` ist die Akzentflaeche in Neon Rot und gehoert genau einmal pro
 * Ansicht auf die wichtigste Handlung.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: [
    'bg-accent text-accent-ink font-semibold',
    'shadow-[0_2px_8px_rgba(255,51,85,0.3),inset_0_1px_0_rgba(255,255,255,0.15)]',
    'hover:bg-accent-strong hover:shadow-[0_4px_16px_rgba(255,51,85,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]',
    'hover:-translate-y-px',
    'active:bg-accent-deep active:translate-y-0 active:shadow-[0_1px_4px_rgba(255,51,85,0.2),inset_0_2px_4px_rgba(0,0,0,0.2)]',
  ].join(' '),
  secondary: [
    'bg-surface-3 text-ink border border-line-interactive',
    'shadow-[0_1px_3px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]',
    'hover:bg-surface-2 hover:border-ink-subtle hover:-translate-y-px hover:shadow-[0_3px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]',
    'active:translate-y-0 active:bg-surface-1 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]',
  ].join(' '),
  ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface-2 active:bg-surface-3',
  danger: [
    'bg-transparent text-critical border border-critical/50',
    'hover:bg-critical/10 hover:border-critical/70',
    'active:bg-critical/20',
  ].join(' '),
};

const SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
};

export function buttonClasses(
  variant: ButtonVariant = 'secondary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  return cn(
    'inline-flex items-center justify-center rounded-md transition-all duration-200 ease-out',
    'disabled:cursor-not-allowed disabled:opacity-50',
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Zeigt einen Ladezustand und sperrt gegen Doppelklicks. */
  busy?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  busy = false,
  className,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || busy}
      // Damit Hilfstechnik den Ladezustand mitbekommt, nicht nur das Auge.
      aria-busy={busy || undefined}
      className={buttonClasses(variant, size, className)}
    >
      {busy ? 'Bitte warten …' : children}
    </button>
  );
}

export interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
}

/** Sieht aus wie eine Schaltflaeche, ist aber ein Link -- und bleibt einer. */
export function LinkButton({
  href,
  variant = 'secondary',
  size = 'md',
  className,
  children,
}: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {children}
    </Link>
  );
}
