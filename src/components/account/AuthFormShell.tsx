// src/components/account/AuthFormShell.tsx
import type { ReactNode } from 'react';
import { Container } from '@/components/layout/Container';

// Same logo URL used in Header.tsx and CartPage.tsx
const logoSrc = 'https://cdn.jsdelivr.net/gh/Yuki-az-23/aluf-frontend@master/src/assets/logo.png';

interface AuthFormShellProps {
  title: string;
  children: ReactNode;
}

export function AuthFormShell({ title, children }: AuthFormShellProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <a href="/">
              <img src={logoSrc} alt="Aluf Computers" className="h-12 w-auto mx-auto mb-4" />
            </a>
            <h1 className="text-2xl font-bold text-text-main">{title}</h1>
          </div>
          <div className="bg-card-bg rounded-2xl shadow-lg p-8">
            {children}
          </div>
        </div>
      </Container>
    </div>
  );
}
