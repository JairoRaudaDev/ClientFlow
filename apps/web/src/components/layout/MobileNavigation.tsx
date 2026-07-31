import { NavLink } from '@/components/layout/NavLink';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/settings', label: 'Settings' },
];

export function MobileNavigation() {
  return (
    <nav
      aria-label="Workspace"
      className="border-border flex gap-1 overflow-x-auto border-b px-4 py-2"
    >
      {links.map((link) => (
        <NavLink key={link.href} href={link.href} className="shrink-0">
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
