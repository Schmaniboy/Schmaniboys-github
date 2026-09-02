import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';
import { useId } from 'react';

import { cn } from '@/lib/cn';

/**
 * Formularfelder.
 *
 * Jedes Feld hat ein sichtbares Label -- Platzhaltertext ersetzt kein Label,
 * er verschwindet beim Tippen. Fehlermeldungen werden ueber `aria-describedby`
 * verknuepft und mit `aria-invalid` markiert, damit sie vorgelesen werden.
 */

/*
 * `text-base sm:text-sm` ist kein Schoenheitsfehler, sondern Absicht:
 * Safari auf dem iPhone zoomt beim Hineintippen in ein Feld, dessen Schrift
 * kleiner als 16px ist. Die Seite steht danach verschoben da, und der
 * Zurueckweg ist Handarbeit. Auf dem Telefon also 16px, ab der mittleren
 * Breite die feinere Groesse.
 *
 * `h-11` statt `h-10` aus demselben Grund: 44px ist die Groesse, ab der ein
 * Ziel mit dem Daumen zuverlaessig zu treffen ist.
 */
const CONTROL_CLASSES =
  'glass-input w-full rounded-md px-3 text-base sm:text-sm text-ink ' +
  'placeholder:text-ink-subtle ' +
  'disabled:cursor-not-allowed disabled:opacity-50 ' +
  'aria-[invalid=true]:border-critical aria-[invalid=true]:shadow-[0_0_0_3px_rgba(248,113,113,0.15)]';

function FieldFrame({
  id,
  label,
  hint,
  error,
  pflicht,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string | undefined;
  /** Markiert das Feld sichtbar als Pflichtfeld. */
  pflicht?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
        {/*
          * Die Kennzeichnung kommt aus `required` und wird nicht in den
          * Beschriftungstext geschrieben. Sonst liest ein Screenreader
          * "Bezeichnung Stern" -- und irgendwann steht der Stern an einem
          * Feld, das gar nicht mehr Pflicht ist.
          */}
        {pflicht ? (
          <span className="text-accent" aria-hidden="true">
            {' *'}
          </span>
        ) : null}
      </label>
      {children}
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

export interface InputFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string | undefined;
}

export function InputField({ label, hint, error, className, ...props }: InputFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} pflicht={props.required}>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL_CLASSES, 'h-11', className)}
      />
    </FieldFrame>
  );
}

export interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string | undefined;
  children: ReactNode;
}

export function SelectField({
  label,
  hint,
  error,
  className,
  children,
  ...props
}: SelectFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} pflicht={props.required}>
      <select
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL_CLASSES, 'h-11', className)}
      >
        {children}
      </select>
    </FieldFrame>
  );
}

export interface TextareaFieldProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'> {
  label: string;
  hint?: string;
  error?: string | undefined;
}

export function TextareaField({ label, hint, error, className, ...props }: TextareaFieldProps) {
  const id = useId();
  return (
    <FieldFrame id={id} label={label} hint={hint} error={error} pflicht={props.required}>
      <textarea
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={cn(CONTROL_CLASSES, 'py-2', className)}
      />
    </FieldFrame>
  );
}

/**
 * Ankreuzfeld.
 *
 * Anders aufgebaut als die uebrigen Felder, und zwar mit Absicht: Bei einem
 * Ankreuzfeld steht die Beschriftung neben dem Kaestchen, nicht darueber --
 * und sie muss anklickbar sein, weil das Kaestchen allein ein zu kleines
 * Ziel ist. Besonders auf dem Telefon.
 */
export interface CheckboxFieldProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'type'> {
  label: ReactNode;
  hint?: string;
  error?: string | undefined;
}

export function CheckboxField({ label, hint, error, className, ...props }: CheckboxFieldProps) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <div className="flex items-start gap-2">
        <input
          {...props}
          type="checkbox"
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${id}-error` : hint ? `${id}-hint` : undefined
          }
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 rounded border-line-interactive bg-surface-1 accent-accent',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        />
        <label htmlFor={id} className="text-sm text-ink-muted">
          {label}
        </label>
      </div>
      {hint && !error ? (
        <p id={`${id}-hint`} className="pl-6 text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="pl-6 text-xs text-critical" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
