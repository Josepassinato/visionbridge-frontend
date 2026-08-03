import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VisionBridge Admin',
  description: 'Visual intelligence platform admin dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-dark-900 text-dark-50 antialiased">
        {children}
      </body>
    </html>
  );
}
