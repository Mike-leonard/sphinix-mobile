import AuthModal from '@/components/AuthModal';

export default function AuthModalLayout({ children }) {
  return (
    <AuthModal>
      {children}
    </AuthModal>
  );
}
