import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  children: ReactNode;
  onNavigate?: (page: string) => void;
  cartCount?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout({
  children,
  onNavigate,
  cartCount,
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      {/* Header - Sticky Navigation */}
      {showHeader && (
        <Header onNavigate={onNavigate} cartCount={cartCount} />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer - Company Info & Links */}
      {showFooter && (
        <Footer onNavigate={onNavigate} />
      )}
    </div>
  );
}
