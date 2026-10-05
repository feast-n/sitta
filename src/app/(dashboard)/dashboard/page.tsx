export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Inventory Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan stok barang dan transaksi inventaris real-time.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500">Total Products</p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">124</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500">Low Stock Items</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">8</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500">Stock In (This Month)</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">+450</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <p className="text-xs font-medium text-gray-500">Stock Out (This Month)</p>
          <p className="mt-2 text-3xl font-bold text-rose-600">-120</p>
        </div>
      </div>
    </div>
  );
}