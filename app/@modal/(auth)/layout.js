import AuthModal from '@/components/auth/AuthModal';

export default function AuthModalLayout({ children }) {
  return (
    <AuthModal>
      {children}
    </AuthModal>
  );
}
