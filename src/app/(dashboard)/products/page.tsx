import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { ProductForm } from '@/components/products/product-form';
import { DeleteProductButton } from '@/components/products/delete-product-button';
import type { Product } from '@/lib/products/types';

export const dynamic = 'force-dynamic';

const LOW_STOCK_THRESHOLD = 10;

function formatIDR(value: number): string {
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default async function ProductsPage() {
  const context = await getSessionContext();
  if (!context) {
    redirect('/login');
  }

  // RLS scopes this query to the caller's organization, so no manual
  // organization_id filter is needed (and none is accepted from input).
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  const products: Product[] = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Products &amp; Inventory
          </h1>
          <p className="text-sm text-gray-500">
            Kelola katalog barang dan stok di organisasi{' '}
            {context.organizationName}.
          </p>
        </div>
        <ProductForm />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300"
        >
          Gagal memuat produk: {error.message}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:border-gray-800 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">Product Name</th>
              <th className="px-6 py-3">SKU</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {products.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Belum ada produk. Klik <strong>+ Add Product</strong> untuk
                  membuat produk pertama.
                </td>
              </tr>
            ) : (
              products.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.stock < LOW_STOCK_THRESHOLD
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {item.stock} unit
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {formatIDR(item.price)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {context.role === 'admin' ? (
                      <DeleteProductButton id={item.id} />
                    ) : (
                      <span className="text-xs text-gray-400">Read only</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}