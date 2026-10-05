'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { initialAuthState } from '@/lib/auth/types';
import { signUpAction } from '@/lib/auth/actions';

const inputClass =
  'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white';

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialAuthState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="full_name"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Nama Lengkap
        </label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          required
          autoComplete="name"
          className={inputClass}
          placeholder="Pandu Admin"
        />
      </div>

      <div>
        <label
          htmlFor="organization_name"
          className="mb-1 block text-xs font-medium text-gray-700 dark:text-gray-300"
        >
          Nama Organisasi
        </label>
        <input
          id="organization_name"
          name="organization_name"
          type="text"
          required
          className={inputClass}
          placeholder="Acme Logistics Corp"
        />
      </div>

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
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
          placeholder="Minimal 8 karakter"
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

      {state.success ? (
        <p
          role="status"
          className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
        >
          {state.success}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
      >
        {pending ? 'Mendaftarkan...' : 'Daftar'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-medium text-blue-600 hover:underline">
          Masuk di sini
        </Link>
      </p>
    </form>
  );
}