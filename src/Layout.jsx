import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LanguageProvider, useLanguage } from '@/components/i18n/LanguageContext';
import { SidebarProvider, useSidebar } from '@/lib/SidebarContext';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import Logo from '@/components/Logo';
import { Menu } from 'lucide-react';

function LayoutContent({ children, currentPageName }) {
  const { t, language, changeLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { toggleMobile, isMobileOpen } = useSidebar();
  const shouldRenderSidebar = currentPageName !== 'Home' && currentPageName !== 'Login' && currentPageName !== 'Register';

  const handleLogout = () => {
    logout(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
        
        :root {
          --background: 28 20% 98%;
          --foreground: 220 13% 28%;
          --primary: 17 88% 60%;
          --coral: 17 88% 60%;
          --violet: 258 90% 66%;
          --gray-dark: 220 13% 28%;
          --gray-medium: 220 9% 46%;
        }
        
        body {
          color: hsl(var(--gray-dark));
        }
        
        .font-display {
          font-family: 'Sora', sans-serif;
        }
        
        .font-sans {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        h1, h2, h3, h4 {
          font-family: 'Sora', sans-serif;
        }
      `}</style>

      {/* Main Content */}
      <div className="min-h-screen overflow-x-hidden">
        {shouldRenderSidebar && <Sidebar user={user} />}

        {shouldRenderSidebar && !isMobileOpen ? (
          <button
            type="button"
            onClick={toggleMobile}
            className="md:hidden fixed left-3 top-3 z-[60] inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-[#3B4759] shadow-sm backdrop-blur"
            aria-label="Ouvrir le menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        ) : null}

        <div className={`${shouldRenderSidebar ? 'md:pl-56' : ''}`}>
          <main className={`min-w-0 w-full px-0 sm:px-0 md:px-0 lg:px-0 ml-0 ${shouldRenderSidebar ? 'pt-12 md:pt-0' : ''}`}>
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#3B4759] text-[#8A98AD] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/95 rounded-xl px-3 py-2 inline-flex">
                  <Logo size="md" showText={false} />
                </div>
              </div>
              <p className="text-[#111827] max-w-sm">
                {language === 'fr' 
                  ? "La plateforme de référence pour la cession et reprise d'entreprises."
                  : "The leading platform for business acquisitions and sales."}
              </p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">
                {language === 'fr' ? 'Plateforme' : 'Platform'}
              </h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl('Annonces')} className="hover:text-white transition-colors">{t('businesses')}</Link></li>
                <li><Link to={createPageUrl('BuyersDirectory')} className="hover:text-white transition-colors">{t('buyers_directory')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-display font-semibold text-white mb-4">
                {language === 'fr' ? 'Contact' : 'Contact'}
              </h4>
              <p className="text-[#111827]">contact@riviqo.com</p>
            </div>
          </div>
          <div className="border-t border-[#4A5668] mt-12 pt-8 text-center text-sm">
            © {new Date().getFullYear()} Riviqo. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <SidebarProvider>
      <LanguageProvider>
        <LayoutContent currentPageName={currentPageName}>{children}</LayoutContent>
      </LanguageProvider>
    </SidebarProvider>
  );
}
