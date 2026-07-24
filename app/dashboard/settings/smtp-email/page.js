import React from 'react';
import SmtpSettingsSection from './_components/SmtpSettingsSection';

export const metadata = {
  title: 'SMTP & Email Settings | Admin Dashboard',
  description: 'Configure SMTP server credentials and support ticket receiver email.'
};

export default function SmtpEmailPage() {
  return (
    <SmtpSettingsSection />
  );
}
