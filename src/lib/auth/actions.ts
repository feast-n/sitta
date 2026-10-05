'use server';

import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { AuthState } from '@/lib/auth/types';

function readString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

/** Only allow same-origin relative paths to prevent open-redirect. */
function safeRedirectPath(target: string | null, fallback: string): string {
  if (!target) return fallback;
  if (!target.startsWith('/') || target.startsWith('//')) return fallback;
  return target;
}

export async function signInAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const email = readString(formData, 'email');
  const password = readString(formData, 'password');
  const redirectTo = safeRedirectPath(
    readString(formData, 'redirectTo') || null,
    '/dashboard',
  );

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.', success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Do not leak whether the email exists.
    return { error: 'Email atau password salah.', success: null };
  }

  redirect(redirectTo);
}

/**
 * Creates the Supabase auth user. The `handle_new_user` DB trigger
 * (see supabase/migrations) provisions the organization and admin profile.
 */
export async function signUpAction(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const fullName = readString(formData, 'full_name');
  const organizationName = readString(formData, 'organization_name');
  const email = readString(formData, 'email');
  const password = readString(formData, 'password');

  if (!fullName || !organizationName || !email || !password) {
    return { error: 'Semua kolom wajib diisi.', success: null };
  }

  if (password.length < 8) {
    return { error: 'Password minimal 8 karakter.', success: null };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        organization_name: organizationName,
      },
    },
  });

  if (error) {
    return { error: `Gagal mendaftar: ${error.message}`, success: null };
  }

  if (!data.session) {
    return {
      error: null,
      success:
        'Pendaftaran berhasil. Silakan cek email Anda untuk konfirmasi sebelum masuk.',
    };
  }

  redirect('/dashboard');
}

export async function signOutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect('/login');
}