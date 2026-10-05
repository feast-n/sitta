'use client';

import { useActionState, useState } from 'react';
import { initialProductState } from '@/lib/products/types';
import { createProductAction } from '@/lib/products/actions';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    createProductAction,
    initialProductState,
  );
  const [handledSuccess, setHandledSuccess] = useState<string | null>(null);

  // Adjusting state during render is the React-recommended alternative to an
  // effect here: react to the server action result without a cascading render.
  if (state.success && state.success !== handledSuccess) {
    setHandledSuccess(state.success);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        + Add Product
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:border dark:border-gray-800 dark:bg-gray-900">
        <h3 className="mb-4 text-lg font-bold text-gray-900 dark:text-white">
          Add New Product
        </h3>
        {/* key remounts the form after a success, which clears every field. */}
        <form
          key={handledSuccess ?? 'fresh'}
          action={formAction}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="product-name"
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              Product Name
            </label>
            <input
              id="product-name"
              name="name"
              type="text"
              required
              className={inputClass}
              placeholder="e.g. Laptop Asus ROG"
            />
          </div>

          <div>
            <label
              htmlFor="product-sku"
              className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
            >
              SKU Code
            </label>
            <input
              id="product-sku"
              name="sku"
              type="text"
              required
              className={inputClass}
              placeholder="e.g. LAP-ASUS-001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-stock"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Initial Stock
              </label>
              <input
                id="product-stock"
                name="stock"
                type="number"
                required
                min="0"
                step="1"
                defaultValue="0"
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="product-price"
                className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Price (IDR)
              </label>
              <input
                id="product-price"
                name="price"
                type="number"
                required
                min="0"
                step="1"
                defaultValue="0"
                className={inputClass}
              />
            </div>
          </div>

          {state.error ? (
            <p
              role="alert"
              className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300"
            >
              {state.error}
            </p>
          ) : null}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {pending ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}