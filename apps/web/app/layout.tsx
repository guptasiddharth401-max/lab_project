import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Library SaaS',
  description: 'Student library and Wi-Fi access platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
