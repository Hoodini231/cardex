// ThemeProviderWrapper.tsx
'use client';
import '@/app/globals.css';
import { ThemeProvider } from 'next-themes';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"   // or "system"
      enableSystem={true}   // or false, depending on your needs
    >
      {children}
    </ThemeProvider>
  );
}
