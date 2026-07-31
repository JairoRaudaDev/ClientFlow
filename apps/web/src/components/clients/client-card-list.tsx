import Link from 'next/link';

import { Card } from '@/components/ui/Card';
import { formatDate } from '@/lib/format/date';
import type { Client } from '@/types/client';

interface ClientCardListProps {
  clients: Client[];
  onRequestDelete: (client: Client) => void;
}

/** Mobile presentation. Hidden (display:none) at `md` and above. */
export function ClientCardList({ clients, onRequestDelete }: ClientCardListProps) {
  return (
    <ul className="flex flex-col gap-3 md:hidden">
      {clients.map((client) => (
        <li key={client.id}>
          <Card className="flex flex-col gap-2">
            <Link
              href={`/clients/${client.id}`}
              className="text-foreground focus-visible:ring-accent rounded font-medium focus-visible:ring-2 focus-visible:outline-none"
            >
              {client.name}
            </Link>
            {client.company !== null ? <p className="text-muted text-sm">{client.company}</p> : null}
            <p className="text-muted truncate text-sm">
              {client.email ?? client.phone ?? 'No contact info'}
            </p>
            <p className="text-muted text-xs">
              Updated <time dateTime={client.updatedAt}>{formatDate(client.updatedAt)}</time>
            </p>
            <div className="flex items-center gap-4 pt-1">
              <Link
                href={`/clients/${client.id}/edit`}
                className="text-accent focus-visible:ring-accent rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => onRequestDelete(client)}
                className="focus-visible:ring-accent rounded text-sm font-medium text-red-600 hover:underline focus-visible:ring-2 focus-visible:outline-none"
              >
                Delete
              </button>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
