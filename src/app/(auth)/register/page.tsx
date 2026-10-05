import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        Buat akun
      </h2>
      <p className="mt-1 mb-6 text-sm text-gray-500">
       Satu organisasi baru akan dibuat otomatis dan Anda menjadi admin-nya.
      </p>
      <RegisterForm />
    </div>
  );
}