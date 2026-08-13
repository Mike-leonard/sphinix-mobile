import ForgotPasswordForm from '@/app/(auth)/forgot-password/_components/ForgotPasswordForm';

export const metadata = {
  title: 'Forgot Password',
  description: 'Reset your Sphinix Mobile account password.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
