'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Button } from './Button';

/**
 * Dialog auf Basis des nativen <dialog>-Elements.
 *
 * Der Browser uebernimmt damit Fokusfalle, Escape-Taste und Hintergrund-
 * Inertisierung. Eine Eigenbau-Loesung waere mehr Code und weniger korrekt.
 */
export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // Escape schliesst nativ -- das muss der aufrufende Zustand mitbekommen.
    const handleClose = () => onClose();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="modal-title"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] rounded-lg border border-line bg-surface-3 p-0 text-ink shadow-overlay backdrop:bg-black/70"
    >
      <div className="border-b border-line px-5 py-4">
        <h2 id="modal-title" className="text-base font-semibold">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4 text-sm text-ink-muted">{children}</div>
      <div className="flex justify-end gap-2 border-t border-line px-5 py-3">
        {footer ?? (
          <Button variant="ghost" onClick={onClose}>
            Schliessen
          </Button>
        )}
      </div>
    </dialog>
  );
}
