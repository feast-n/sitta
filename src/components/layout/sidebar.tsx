'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

// Only routes that actually exist — a nav link to a missing page is a 404.
const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Products / Inventory', href: '/products', icon: '📦' },
];

export function Sidebar({ organizationName }: { organizationName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6 dark:border-gray-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
          N
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight text-gray-900 dark:text-white">
            NEXIS SITTA
          </h1>
          <p className="text-xs text-gray-500">Multi-Tenant Inventory</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white',
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-200 p-4 dark:border-gray-800">
        <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
          <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Active Tenant
          </p>
          <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {organizationName}
          </p>
        </div>
      </div>
    </aside>
  );
}