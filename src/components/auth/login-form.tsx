'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/types';
import { signInAction } from '@/lib/auth/actions';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, formAction, pending] = useActionState(
    signInAction,
    initialAuthState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo ? <input type="hidden" name="redirectTo" value={redirectTo} /> : null}

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="admin@perusahaan.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950 dark:text-rose-300"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Memproses...' : 'Masuk'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-blue-600 hover:underline">
          Daftar di sini
        </Link>
      </p>
    </form>
  );
}