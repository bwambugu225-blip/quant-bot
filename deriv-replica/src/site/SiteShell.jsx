import React from 'react';
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import HomePage from './HomePage.jsx';
import { MarketsIndex, MarketPage, PlatformsIndex, PlatformPage, HelpCentre, PaymentMethods, ContentPage, NotFound } from './Pages.jsx';
import { LoginPage, SignupPage, CallbackPage } from './SiteAuth.jsx';
import { useRoute } from './router.jsx';

function Routes() {
  const path = useRoute();
  const p = path.replace(/\/+$/, '') || '/';

  if (p === '/') return <HomePage />;
  if (p === '/login') return <LoginPage />;
  if (p === '/signup') return <SignupPage />;
  // OAuth redirect target (registered as `<origin>/callback`).
  if (p === '/callback') return <CallbackPage />;
  if (p === '/help-centre') return <HelpCentre />;
  if (p === '/payment-methods') return <PaymentMethods />;

  if (p === '/markets' || p === '/markets/derived-indices/synthetic-indices') return <MarketsIndex />;
  if (p.startsWith('/markets/')) {
    const slug = p.split('/')[2];
    return <MarketPage slug={slug} />;
  }
  if (p === '/trading-platforms') return <PlatformsIndex />;
  if (p.startsWith('/trading-platforms/')) {
    const slug = p.split('/')[2];
    return <PlatformPage slug={slug} />;
  }

  // Everything else resolves through the shared content map (legal, about,
  // support and promo pages), keyed by its path without the leading slash.
  const key = p.slice(1);
  if (key && key in CONTENT_KEYS) return <ContentPage slug={key} />;

  return <NotFound />;
}

// Kept in sync with CONTENT in Pages.jsx. Importing the map directly would
// couple this router to that module's export, so the keys are listed here.
const CONTENT_KEYS = {
  'who-we-are': 1,
  'why-choose-us': 1,
  'our-principles': 1,
  regulatory: 1,
  'terms-and-conditions': 1,
  'privacy-policy': 1,
  responsible: 1,
  'fraud-prevention': 1,
  'spread-advantage-hours': 1,
  'trading-competitions': 1,
  promotions: 1,
  'mt5-trading-signals': 1,
  'trading-calculators': 1,
  'trading-specifications': 1,
  'trading-terms-glossary': 1,
  'trade/cfds': 1,
  'trade/options': 1,
  'trading-app-mobile': 1,
  p2p: 1,
  derivlife: 1,
  newsroom: 1,
  'contact-us': 1,
  partners: 1,
};

export default function SiteShell() {
  // RouterProvider lives at the root (main.jsx) so a navigation can swap this
  // whole shell for the trading app. Do not nest another provider here.
  return (
    <>
      <TitleManager />
      <Nav />
      <main id="main-content">
        <Routes />
      </main>
      <Footer />
    </>
  );
}

const TITLES = {
  '/': 'Online broker for trading anytime, anywhere | Deriv',
  '/login': 'Log in | Deriv',
  '/signup': 'Open account | Deriv',
  '/help-centre': 'Help centre | Deriv',
  '/payment-methods': 'Payment methods | Deriv',
};

function TitleManager() {
  const path = useRoute().replace(/\/+$/, '') || '/';
  React.useEffect(() => {
    if (TITLES[path]) {
      document.title = TITLES[path];
      return;
    }
    if (path.startsWith('/markets/')) {
      const slug = path.split('/')[2] || '';
      document.title = `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Deriv`;
      return;
    }
    if (path.startsWith('/trading-platforms/')) {
      const slug = path.split('/')[2] || '';
      document.title = `${slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} | Deriv`;
      return;
    }
    document.title = 'Deriv | Online trading platform';
  }, [path]);
  return null;
}
