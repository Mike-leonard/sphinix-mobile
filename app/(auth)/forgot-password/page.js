import ForgotPasswordForm from '@/app/(auth)/forgot-password/_components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password | Sphinix Mobile',
  description: 'Reset your password to regain access to your account.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
