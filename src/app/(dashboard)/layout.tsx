import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth/session';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // proxy.ts already blocks unauthenticated requests; this is defence in depth
  // and guarantees the layout always has a tenant to render.
  const context = await getSessionContext();
  if (!context) {
    redirect('/login');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      <Sidebar organizationName={context.organizationName} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar
          fullName={context.fullName}
          email={context.email}
          role={context.role}
          organizationName={context.organizationName}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}