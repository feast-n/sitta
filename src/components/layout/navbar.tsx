import { signOutAction } from '@/lib/auth/actions';
import type { Role } from '@/lib/auth/session';

interface NavbarProps {
  fullName: string;
  email: string;
  role: Role;
  organizationName: string;
}

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function Navbar({
  fullName,
  email,
  role,
  organizationName,
}: NavbarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-500">
          {organizationName} /{' '}
          <span className="font-semibold text-gray-900 dark:text-white">
            Dashboard
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            {initials(fullName)}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {fullName}
            </p>
            <p className="text-xs text-gray-500">{email}</p>
          </div>
          <span className="hidden rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 capitalize sm:inline dark:bg-emerald-950 dark:text-emerald-300">
            {role}
          </span>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Keluar
          </button>
        </form>
      </div>
    </header>
  );
}