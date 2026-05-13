import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OrgaLancer - Tariff Calculator',
  description: 'Calculate your freelance tariff with AI explanations',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
