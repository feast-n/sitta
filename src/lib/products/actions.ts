'use server';

import { revalidatePath } from 'next/cache';
import { getSessionContext } from '@/lib/auth/session';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { ProductState } from '@/lib/products/types';

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function createProductAction(
  _prevState: ProductState,
  formData: FormData,
): Promise<ProductState> {
  const context = await getSessionContext();
  if (!context) {
    return { error: 'Sesi tidak valid. Silakan masuk kembali.', success: null };
  }

  const name = readString(formData, 'name');
  const sku = readString(formData, 'sku');
  const stock = Number(readString(formData, 'stock'));
  const price = Number(readString(formData, 'price'));

  if (!name || !sku) {
    return { error: 'Nama produk dan SKU wajib diisi.', success: null };
  }
  if (!Number.isFinite(stock) || stock < 0) {
    return { error: 'Stok harus angka dan tidak boleh negatif.', success: null };
  }
  if (!Number.isFinite(price) || price < 0) {
    return { error: 'Harga harus angka dan tidak boleh negatif.', success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('products').insert({
    // organization_id is bound from the session, never from user input,
    // so a crafted request cannot write into another tenant.
    organization_id: context.organizationId,
    name,
    sku,
    stock,
    price,
  });

  if (error) {
    return { error: `Gagal menambah produk: ${error.message}`, success: null };
  }

  revalidatePath('/products');
  revalidatePath('/dashboard');
  return { error: null, success: 'Produk berhasil ditambahkan.' };
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  const context = await getSessionContext();
  if (!context) return;

  // RBAC: destructive actions are restricted to admins. RLS is the real
  // boundary; this check keeps the intent explicit and fails fast.
  if (context.role !== 'admin') {
    throw new Error('Hanya admin yang dapat menghapus produk.');
  }

  const id = readString(formData, 'id');
  if (!id) return;

  const supabase = await createSupabaseServerClient();
  await supabase.from('products').delete().eq('id', id);

  revalidatePath('/products');
  revalidatePath('/dashboard');
}