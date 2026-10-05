'use client';

import { useFormStatus } from 'react-dom';
import { deleteProductAction } from '@/lib/products/actions';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="text-xs font-semibold text-rose-600 hover:text-rose-800 disabled:opacity-50 dark:hover:text-rose-400"
    >
      {pending ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function DeleteProductButton({ id }: { id: string }) {
  return (
    <form action={deleteProductAction}>
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}