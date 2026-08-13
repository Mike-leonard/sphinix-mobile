import LoginForm from '@/app/(auth)/login/_components/LoginForm';

export const metadata = {
  title: 'Sign In',
  description: 'Sign in to your Sphinix Mobile account to access your dashboard.',
};

export default function LoginPage() {
  return <LoginForm />;
}
