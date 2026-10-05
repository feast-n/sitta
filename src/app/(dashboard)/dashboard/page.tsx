import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { Product } from '@/lib/products/types';

export const dynamic = 'force-dynamic';

const LOW_STOCK_THRESHOLD = 10;

function formatIDR(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default async function DashboardPage() {
  const context = await getSessionContext();
  if (!context) {
    redirect('/login');
  }

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from('products')
    .select('stock, price');

  const products: Pick<Product, 'stock' | 'price'>[] = data ?? [];

  const totalProducts = products.length;
  const lowStockItems = products.filter(
    (item) => item.stock < LOW_STOCK_THRESHOLD,
  ).length;
  const totalUnits = products.reduce((sum, item) => sum + item.stock, 0);
  const inventoryValue = products.reduce(
    (sum, item) => sum + item.stock * item.price,
    0,
  );

  const stats = [
    { label: 'Total Products', value: String(totalProducts), tone: 'text-gray-900 dark:text-white' },
    { label: 'Low Stock Items', value: String(lowStockItems), tone: 'text-amber-600' },
    { label: 'Total Units', value: String(totalUnits), tone: 'text-emerald-600' },
    { label: 'Inventory Value', value: formatIDR(inventoryValue), tone: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Inventory Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Ringkasan stok barang {context.organizationName} secara real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="text-xs font-medium text-gray-500">{stat.label}</p>
            <p
              className={`mt-2 text-3xl font-bold ${stat.tone} ${
                stat.label === 'Inventory Value' ? 'text-2xl' : ''
              }`}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {totalProducts === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:bg-gray-900">
          Belum ada produk. Buka menu{' '}
          <strong>Products / Inventory</strong> untuk menambahkan produk pertama.
        </p>
      ) : null}
    </div>
  );
}