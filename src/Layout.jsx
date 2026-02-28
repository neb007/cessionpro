import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useLanguage } from '@/components/i18n/LanguageContext';
import { SidebarProvider, useSidebar } from '@/lib/SidebarContext';
import { useAuth } from '@/lib/AuthContext';
import Sidebar from '@/components/layout/Sidebar';
import PublicNav from '@/components/layout/PublicNav';
import { Toaster } from '@/components/ui/toaster';

import { Menu } from 'lucide-react';

const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';

function FontLoader() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.googleapis.com';
    const preconnectStatic = document.createElement('link');
    preconnectStatic.rel = 'preconnect';
    preconnectStatic.href = 'https://fonts.gstatic.com';
    preconnectStatic.crossOrigin = 'anonymous';
    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href = GOOGLE_FONTS_URL;
    document.head.append(preconnect, preconnectStatic, stylesheet);
  }, []);
  return null;
}

function CSSVariables() {
  const injected = useRef(false);
  useEffect(() => {
    if (injected.current) return;
    injected.current = true;
    const style = document.createElement('style');
    style.setAttribute('data-layout-vars', '');
    style.textContent = `
      :root {
        --background: 28 20% 98%;
        --foreground: 220 13% 28%;
        --primary: 17 88% 60%;
        --coral: 17 88% 60%;
        --violet: 258 90% 66%;
        --gray-dark: 220 13% 28%;
        --gray-medium: 220 9% 46%;
      }
      body { color: hsl(var(--gray-dark)); }
      .font-display { font-family: 'Sora', sans-serif; }
      .font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      .font-mono { font-family: 'JetBrains Mono', monospace; }
      body { font-family: 'Plus Jakarta Sans', sans-serif; }
      h1, h2, h3, h4 { font-family: 'Sora', sans-serif; }
      @keyframes flag-flutter {
        0%   { transform: scaleX(1)   skewY(0deg); }
        15%  { transform: scaleX(0.92) skewY(1.5deg); }
        30%  { transform: scaleX(1.04) skewY(-1deg); }
        50%  { transform: scaleX(0.95) skewY(1.8deg); }
        65%  { transform: scaleX(1.02) skewY(-0.8deg); }
        80%  { transform: scaleX(0.97) skewY(1.2deg); }
        100% { transform: scaleX(1)   skewY(0deg); }
      }
      .flag-animated {
        display: inline-block;
        animation: flag-flutter 3s ease-in-out infinite;
        transform-origin: left center;
      }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

function LayoutContent({ children, currentPageName }) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toggleMobile, isMobileOpen } = useSidebar();
  const isAuthenticated = Boolean(user);
  const hideSidebarPages = ['Home', 'Login', 'Register', 'Valuations', 'Financing', 'Targeting'];
  const shouldRenderSidebar =
    isAuthenticated &&
    !hideSidebarPages.includes(currentPageName);
  // Pages that manage their own nav or don't need a public nav
  const noPublicNavPages = ['Home', 'Login', 'Register', 'AccountCreation',
    'AuthCallback', 'PasswordReset'];
  const showPublicNav = (!isAuthenticated || hideSidebarPages.includes(currentPageName))
    && !shouldRenderSidebar
    && !noPublicNavPages.includes(currentPageName);

  return (
    <div className="min-h-screen bg-[#FAF9F7]">
      <FontLoader />
      <CSSVariables />

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

        <div className={`${shouldRenderSidebar ? 'md:ml-56 md:w-[calc(100%-14rem)]' : 'w-full'} min-h-screen flex flex-col`}>
          {showPublicNav && <PublicNav />}

          <main className={`min-w-0 w-full flex-1 ${shouldRenderSidebar ? 'pt-12 md:pt-0' : ''}`}>
            {children}
          </main>

          <footer className="bg-[#1F2735] text-[#B7C2D4] pt-16 pb-8 w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-3 mb-4">
                    <img src="/riviqo-favicon.svg" alt="Riviqo" className="w-9 h-9 rounded-xl" />
                    <span className="font-heading font-bold text-lg text-white">Riviqo</span>
                  </div>
                  <p className="text-sm text-[#9EABC1] leading-relaxed">
                    {language === 'fr'
                      ? "Plateforme et service d'accompagnement M&A dédié à la transmission d'entreprise."
                      : 'Platform and M&A advisory service dedicated to business transfer.'}
                  </p>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-white mb-4">
                    {language === 'fr' ? 'Solutions' : 'Solutions'}
                  </h4>
                  <ul className="space-y-2.5">
                    <li><Link to={createPageUrl('Ceder')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Céder' : 'Sell'}</Link></li>
                    <li><Link to={createPageUrl('Reprendre')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Reprendre' : 'Buy'}</Link></li>
                    <li><Link to={createPageUrl('SmartMatchingFeatures')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">SmartMatching</Link></li>
                    <li><Link to={createPageUrl('Pricing')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Prix' : 'Pricing'}</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-white mb-4">
                    {language === 'fr' ? 'Outils' : 'Tools'}
                  </h4>
                  <ul className="space-y-2.5">
                    <li><Link to={createPageUrl('Valuations')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Simulateur valorisation' : 'Valuation simulator'}</Link></li>
                    <li><Link to={createPageUrl('Financing')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Simulateur financement' : 'Financing simulator'}</Link></li>
                    <li><Link to={createPageUrl('Targeting')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Simulateur de cession' : 'Sale simulator'}</Link></li>
                    <li><Link to={createPageUrl('Dataroom')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">Data Room</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-white mb-4">
                    {language === 'fr' ? 'Ressources' : 'Resources'}
                  </h4>
                  <ul className="space-y-2.5">
                    <li><Link to={createPageUrl('Blog')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">Blog</Link></li>
                    <li><Link to={createPageUrl('GuideCession')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Guide de cession' : 'Sale guide'}</Link></li>
                    <li><Link to={createPageUrl('GuideRepreneur')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Guide du repreneur' : 'Buyer guide'}</Link></li>
                    <li><Link to={createPageUrl('FAQ')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">FAQ</Link></li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-display font-semibold text-sm text-white mb-4">
                    {language === 'fr' ? 'Légal' : 'Legal'}
                  </h4>
                  <ul className="space-y-2.5">
                    <li><Link to={createPageUrl('MentionsLegales')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Mentions légales' : 'Legal notice'}</Link></li>
                    <li><Link to={createPageUrl('CGU')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? "Conditions d'utilisation" : 'Terms of use'}</Link></li>
                    <li><Link to={createPageUrl('PolitiqueConfidentialite')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">{language === 'fr' ? 'Politique de confidentialité' : 'Privacy policy'}</Link></li>
                    <li><Link to={createPageUrl('PolitiqueConfidentialite')} className="text-sm text-[#9EABC1] hover:text-[#FF6B4A] transition-colors">Cookies</Link></li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#8E9BB0]">
                <div>
                  © {new Date().getFullYear()} Riviqo. {language === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
                </div>
                <div className="flex items-center gap-2">
                  <span>Made in Europe <span className="flag-animated text-base">🇪🇺</span></span>
                  <span>•</span>
                  <span>{language === 'fr' ? 'Conçu en France' : 'Designed in France'} <span className="flag-animated text-base" style={{ animationDelay: '0.3s' }}>🇫🇷</span></span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  return (
    <SidebarProvider>
      <LayoutContent currentPageName={currentPageName}>{children}</LayoutContent>
    </SidebarProvider>
  );
}
