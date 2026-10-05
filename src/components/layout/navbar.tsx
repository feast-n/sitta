'use client';

export function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-4">
        <h2 className="text-sm font-medium text-gray-500">
          Organization / <span className="font-semibold text-gray-900 dark:text-white">Dashboard</span>
        </h2>
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            PA
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Pandu Admin</p>
            <p className="text-xs text-gray-500">Admin Role</p>
          </div>
        </div>
      </div>
    </header>
  );
}