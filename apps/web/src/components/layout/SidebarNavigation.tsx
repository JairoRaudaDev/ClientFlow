import { NavLink } from '@/components/layout/NavLink';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clients' },
  { href: '/settings', label: 'Settings' },
];

export function SidebarNavigation() {
  return (
    <nav aria-label="Workspace" className="flex flex-col gap-1">
      {links.map((link) => (
        <NavLink key={link.href} href={link.href}>
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
