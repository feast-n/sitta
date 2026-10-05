/**
 * Shared product form state.
 * Kept out of `actions.ts` because a `'use server'` module may only export
 * async functions.
 */
export interface ProductState {
  error: string | null;
  success: string | null;
}

export const initialProductState: ProductState = { error: null, success: null };

export interface Product {
  id: string;
  organization_id: string;
  name: string;
  sku: string;
  stock: number;
  price: number;
  created_at: string;
}