import type { Metadata } from 'next';
import './globals.css';
import SupabaseProvider from './components/SupabaseProvider';

export const metadata: Metadata = {
  title: 'Smart Bookmark App',
  description: 'A simple bookmark manager with Google Auth and real-time sync',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <SupabaseProvider>
          <main className="container mx-auto px-4 py-8 max-w-4xl">
            {children}
          </main>
        </SupabaseProvider>
      </body>
    </html>
  );
}
