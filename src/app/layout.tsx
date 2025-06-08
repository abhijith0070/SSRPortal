import ClientLayout from './client-layout';
import { metadata } from './metadata';
import { Inter } from 'next/font/google';
import './globals.css';
export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ['latin'] });

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
