export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
            N
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            NEXIS SITTA
          </h1>
          <p className="text-sm text-gray-500">Multi-Tenant Inventory Platform</p>
        </div>
        {children}
      </div>
    </div>
  );
}