import ResetPasswordForm from '@/app/(auth)/reset-password/_components/ResetPasswordForm';

export const metadata = {
  title: 'Reset Password | Sphinix Mobile',
  description: 'Enter your new password to regain access to your account.',
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
