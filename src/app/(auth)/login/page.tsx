import { LoginForm } from '@/components/auth/login-form';

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectTo } = await searchParams;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Masuk</h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">
        Masuk untuk mengelola inventaris organisasi Anda.
      </p>
      <LoginForm redirectTo={redirectTo} />
    </div>
  );
}