import Link from 'next/link';

import { formatDate } from '@/lib/format/date';
import type { Client } from '@/types/client';

interface ClientTableProps {
  clients: Client[];
  onRequestDelete: (client: Client) => void;
}

/** Desktop presentation. Hidden (display:none) below `md`, so it never sits in the a11y tree there. */
export function ClientTable({ clients, onRequestDelete }: ClientTableProps) {
  return (
    <table className="hidden w-full text-left text-sm md:table">
      <thead>
        <tr className="border-border text-muted border-b text-xs font-medium tracking-wide uppercase">
          <th scope="col" className="px-3 py-2">
            Name
          </th>
          <th scope="col" className="px-3 py-2">
            Company
          </th>
          <th scope="col" className="px-3 py-2">
            Contact
          </th>
          <th scope="col" className="px-3 py-2">
            Updated
          </th>
          <th scope="col" className="px-3 py-2 text-right">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        {clients.map((client) => (
          <tr key={client.id}>
            <td className="px-3 py-3 font-medium">
              <Link
                href={`/clients/${client.id}`}
                className="text-foreground hover:text-accent focus-visible:ring-accent rounded focus-visible:ring-2 focus-visible:outline-none"
              >
                {client.name}
              </Link>
            </td>
            <td className="text-muted px-3 py-3">{client.company ?? '—'}</td>
            <td className="text-muted max-w-xs truncate px-3 py-3">
              {client.email ?? client.phone ?? '—'}
            </td>
            <td className="text-muted px-3 py-3">
              <time dateTime={client.updatedAt}>{formatDate(client.updatedAt)}</time>
            </td>
            <td className="px-3 py-3">
              <div className="flex items-center justify-end gap-4">
                <Link
                  href={`/clients/${client.id}/edit`}
                  className="text-accent focus-visible:ring-accent rounded text-sm font-medium hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  Edit<span className="sr-only"> {client.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => onRequestDelete(client)}
                  className="focus-visible:ring-accent rounded text-sm font-medium text-red-600 hover:underline focus-visible:ring-2 focus-visible:outline-none"
                >
                  Delete<span className="sr-only"> {client.name}</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
