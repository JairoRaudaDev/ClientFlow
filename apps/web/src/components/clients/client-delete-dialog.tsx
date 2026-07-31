'use client';

import { useEffect, useRef, useState } from 'react';

import type { Client } from '@/types/client';

interface ClientDeleteDialogProps {
  client: Client | null;
  onCancel: () => void;
  onConfirm: (client: Client) => Promise<void>;
}

/** Native `<dialog>` confirmation — focus-trapped and Escape-to-cancel by the browser for free. */
export function ClientDeleteDialog({ client, onCancel, onConfirm }: ClientDeleteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (dialogElement === null) {
      return;
    }

    if (client !== null && !dialogElement.open) {
      setErrorMessage(null);
      setIsDeleting(false);
      dialogElement.showModal();
    } else if (client === null && dialogElement.open) {
      dialogElement.close();
    }
  }, [client]);

  async function handleConfirm() {
    if (client === null || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await onConfirm(client);
    } catch (error) {
      setIsDeleting(false);
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      );
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="delete-client-title"
      className="border-border bg-surface w-full max-w-md rounded-lg border p-6 shadow-lg backdrop:bg-black/40"
      onCancel={(event) => {
        if (isDeleting) {
          event.preventDefault();
        }
      }}
      onClose={() => {
        if (!isDeleting) {
          onCancel();
        }
      }}
    >
      {client !== null ? (
        <div className="flex flex-col gap-4">
          <h2 id="delete-client-title" className="text-foreground text-lg font-semibold">
            Delete client?
          </h2>
          <p className="text-muted text-sm">
            This will permanently delete{' '}
            <span className="text-foreground font-medium">{client.name}</span>. This action cannot
            be undone.
          </p>
          {errorMessage !== null ? (
            <p role="alert" className="text-sm font-medium text-red-600">
              {errorMessage}
            </p>
          ) : null}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="border-border bg-surface text-foreground hover:bg-accent-muted focus-visible:ring-accent rounded-md border px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={isDeleting}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Deleting...' : 'Delete client'}
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
