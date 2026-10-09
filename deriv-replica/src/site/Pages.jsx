import React from 'react';
import { MARKETS, PLATFORMS, TESTIMONIALS, LEGAL_ENTITIES } from './siteData.js';
import { Link, useRoute } from './router.jsx';
import { ArrowRight } from './icons.jsx';
import { SectionHead } from './HomePage.jsx';

function crumbs(items) {
  return (
    <div className="breadcrumbs">
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {it.to ? <Link to={it.to}>{it.label}</Link> : <span>{it.label}</span>}
          {i < items.length - 1 && ' / '}
        </React.Fragment>
      ))}
    </div>
  );
}

export function MarketsIndex() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Markets' }])}
          <h1>Markets</h1>
          <p>
            Trade forex, derived indices, stocks, stock indices, commodities, cryptocurrencies and ETFs — all from one
            Deriv account.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="market-grid">
            {MARKETS.map(m => (
              <div className="market-card" key={m.slug}>
                <div className="market-card__icon">{m.name.charAt(0)}</div>
                <h3>{m.name}</h3>
                <p>{m.blurb}</p>
                <Link to={`/markets/${m.slug}`} className="link-arrow">
                  Learn more <ArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function MarketPage({ slug }) {
  const m = MARKETS.find(x => x.slug === slug);
  if (!m) return <NotFound />;
  const others = MARKETS.filter(x => x.slug !== slug).slice(0, 3);
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Markets', to: '/markets/derived-indices' }, { label: m.name }])}
          <h1>{m.name}</h1>
          <p>{m.blurb}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="support-band">
            <div className="prose">
              <h2>Why trade {m.name} with Deriv</h2>
              <p>{m.intro}</p>
              <ul>
                {m.points.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
                <Link to="/signup" className="button coral_primary">
                  <span className="label">Open account</span>
                </Link>
                <Link to="/trader" className="button white_secondary">
                  <span className="label">Try Deriv Trader</span>
                </Link>
              </div>
            </div>
            <div className="support-visual" aria-hidden="true">
              {m.points.map((p, i) => (
                <div className="support-bubble" key={p}>
                  <b>0{i + 1}</b>
                  {p}
                </div>
              ))}
            </div>
          </div>

          <h2 style={{ marginTop: 72, fontSize: 28 }}>Explore other markets</h2>
          <div className="market-grid" style={{ marginTop: 24 }}>
            {others.map(o => (
              <div className="market-card" key={o.slug}>
                <div className="market-card__icon">{o.name.charAt(0)}</div>
                <h3>{o.name}</h3>
                <p>{o.blurb}</p>
                <Link to={`/markets/${o.slug}`} className="link-arrow">
                  Learn more <ArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function PlatformsIndex() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Platforms' }])}
          <h1>Trading platforms</h1>
          <p>Choose the platform that fits the way you trade.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="market-grid">
            {PLATFORMS.map(p => (
              <div className="market-card" key={p.slug}>
                <div className="market-card__icon">{p.name.replace('Deriv ', '').slice(0, 2).toUpperCase()}</div>
                <h3>{p.name}</h3>
                <p>{p.blurb}</p>
                <Link to={p.to || `/trading-platforms/${p.slug}`} className="link-arrow">
                  Explore <ArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function PlatformPage({ slug }) {
  const p = PLATFORMS.find(x => x.slug === slug);
  if (!p) return <NotFound />;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Platforms', to: '/trading-platforms/deriv-trader' }, { label: p.name }])}
          <h1>{p.name}</h1>
          <p>{p.tagline}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="support-band">
            <div className="prose">
              <h2>{p.tagline}</h2>
              <p>{p.blurb}</p>
              <Link to={p.to || '/signup'} className="button coral_primary">
                <span className="label">Get started</span>
              </Link>
            </div>
            <div className="support-visual" aria-hidden="true">
              <div className="support-bubble">
                <b>Available on</b>
                Web, Desktop, Android and iOS
              </div>
              <div className="support-bubble">
                <b>Markets</b>
                Derived Indices, Forex, Stocks, Commodities, Crypto
              </div>
              <div className="support-bubble">
                <b>Support</b>
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function HelpCentre() {
  const topics = [
    { t: 'Account', d: 'Open an account, verify your identity, and manage your profile.' },
    { t: 'Deposits and withdrawals', d: 'Funding options, processing times, and fees.' },
    { t: 'Deriv Trader', d: 'Contracts, trade types, and platform settings.' },
    { t: 'Deriv MT5', d: 'Log in, switch accounts, and manage your MT5 wallets.' },
    { t: 'Deriv Bot', d: 'Build, run, and host automated strategies.' },
    { t: 'Verification', d: 'Why we verify, and which documents are accepted.' },
    { t: 'Promotions', d: 'Active offers and how to claim them.' },
    { t: 'P2P', d: 'Buy and sell with other traders directly.' },
  ];
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Help centre' }])}
          <h1>Help centre</h1>
          <p>Answers to the most common questions, and a support team that never closes.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <SectionHead title="Browse by topic" />
          <div className="market-grid">
            {topics.map(t => (
              <div className="market-card" key={t.t}>
                <h3>{t.t}</h3>
                <p>{t.d}</p>
                <span className="link-arrow">
                  Read more <ArrowRight />
                </span>
              </div>
            ))}
          </div>
          <div className="cta-band" style={{ marginTop: 56 }}>
            <h2>Still need help?</h2>
            <p>Our support team is online around the clock, every day of the year.</p>
            <Link to="/contact-us" className="button white_secondary button--lg">
              <span className="label">Contact us</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function PaymentMethods() {
  const methods = [
    { n: 'Visa', d: 'Debit and credit cards' },
    { n: 'Mastercard', d: 'Debit and credit cards' },
    { n: 'Skrill', d: 'E-wallet' },
    { n: 'Neteller', d: 'E-wallet' },
    { n: 'Perfect Money', d: 'E-wallet' },
    { n: 'Bank wire', d: 'Direct transfer' },
    { n: 'Bitcoin', d: 'Cryptocurrency' },
    { n: 'Ethereum', d: 'Cryptocurrency' },
  ];
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: 'Payment methods' }])}
          <h1>Payment methods</h1>
          <p>Quick deposits, easy withdrawals, and local payment options mean your money is always accessible.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="market-grid">
            {methods.map(m => (
              <div className="market-card" key={m.n}>
                <div className="market-card__icon">{m.n.charAt(0)}</div>
                <h3>{m.n}</h3>
                <p>{m.d}</p>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32, fontSize: 12.5, color: 'var(--ink-3)' }}>
            *Availability of payment methods and processing speeds may vary based on location and selected payment
            option.
          </p>
        </div>
      </section>
    </>
  );
}

const CONTENT = {
  'who-we-are': {
    title: 'Who we are',
    lead: 'Deriv is a trading platform built by traders, for traders, with 25+ years of experience.',
    body: [
      'We began in 1999 as a team of IT professionals experimenting with derivatives and algorithms. Today, Deriv Group serves millions of traders around the world.',
      'We are privately owned and, uniquely among large brokers, we reinvest most of our profits into building better trading technology rather than paying external shareholders.',
      'Our promise is simple: transparent pricing, honest risk, and tools that put you in control.',
    ],
  },
  'why-choose-us': {
    title: 'Why choose us',
    lead: 'A regulated broker with exclusive markets, capped risk, and 24/7 support.',
    body: [
      'Trade the widest range of products and markets, including our exclusive Derived Indices that are available 365 days a year.',
      'Know your maximum risk upfront. With options on Deriv Trader, you can never lose more than the stake you put in.',
      'Open a free demo account in minutes and practise with zero risk before trading with real funds.',
    ],
  },
  'our-principles': {
    title: 'Our principles',
    lead: 'Fairness, transparency, and putting clients first — by design.',
    body: [
      'We believe clients should be able to understand exactly what they are trading and what it costs.',
      'We design products with capped downside so the most you can lose is always known in advance.',
      'We invest in education and responsible-trading tools so our clients can trade with confidence.',
    ],
  },
  regulatory: {
    title: 'Regulatory information',
    lead: 'Deriv operates through several regulated entities around the world.',
    body: LEGAL_ENTITIES,
  },
  'terms-and-conditions': {
    title: 'Terms and conditions',
    lead: 'The terms that govern your use of Deriv’s services.',
    body: [
      'By opening an account and using our services, you agree to be bound by these terms. Please read them carefully.',
      'Trading derivative products carries a significant risk of loss. You should never trade with money you cannot afford to lose.',
      'These terms are provided for demonstration purposes in this interface replica.',
    ],
  },
  'privacy-policy': {
    title: 'Privacy policy',
    lead: 'How we collect, use, and protect your personal data.',
    body: [
      'We collect the information you give us when you open an account, and the data generated as you use our services.',
      'We use it to provide our services, to meet legal and regulatory obligations, and to improve our products.',
      'We do not sell your personal data. You can request a copy or deletion of your data at any time.',
    ],
  },
  responsible: {
    title: 'Secure & responsible trading',
    lead: 'Tools and guidance to help you stay in control.',
    body: [
      'Set limits on your trading, take breaks, and never trade under pressure.',
      'Deriv offers self-exclusion and account limits to help you trade responsibly.',
      'If you feel that gambling is affecting your life, please seek help from a support organisation in your country.',
    ],
  },
  'fraud-prevention': {
    title: 'Fraud prevention',
    lead: 'How we protect your account and what to watch out for.',
    body: [
      'We use industry-standard security and monitoring to protect your account and your funds.',
      'Be wary of anyone promising guaranteed returns or asking for your password. Deriv staff will never ask for your password.',
      'Report suspected fraud to our support team immediately.',
    ],
  },
  'spread-advantage-hours': {
    title: 'Spread advantage hours',
    lead: 'Trade selected markets at improved spreads during set hours.',
    body: [
      'We offer tighter spreads on selected instruments during scheduled windows throughout the trading week.',
      'Spread advantage hours are applied automatically — no code required.',
      'Check the platform for the current schedule and eligible markets.',
    ],
  },
  'trading-competitions': {
    title: 'Trading competitions',
    lead: 'Compete with traders worldwide and win prizes.',
    body: [
      'Join free and paid competitions and measure your performance against traders around the world.',
      'Climb the leaderboard and win cash prizes.',
      'Competitions run regularly — check back for upcoming events.',
    ],
  },
  promotions: {
    title: 'Promotions',
    lead: 'Current offers for new and existing traders.',
    body: [
      'Take advantage of promotions designed to give your trading a boost.',
      'Terms and eligibility vary by promotion and location.',
      'Log in to your account to see the offers available to you.',
    ],
  },
  'mt5-trading-signals': {
    title: 'MT5 trading signals',
    lead: 'Follow and share trading signals on Deriv MT5.',
    body: [
      'Subscribe to signal providers and mirror their trades automatically in your MT5 account.',
      'Compare providers by performance and risk before you subscribe.',
      'Signals are a tool, not a guarantee. Always trade within your risk limits.',
    ],
  },
  'trading-calculators': {
    title: 'Trading calculator',
    lead: 'Estimate margin, pip value, and swap before you trade.',
    body: [
      'Use our calculators to plan a trade before you place it.',
      'Understand the margin required and the potential profit or loss at different price levels.',
      'Calculators are provided for guidance; live platform values are authoritative.',
    ],
  },
  'trading-specifications': {
    title: 'Trading specifications',
    lead: 'Contract details, trading hours, and limits for every market.',
    body: [
      'Each market has its own contract specifications, including minimum stake, maximum payout, and trading hours.',
      'Derived Indices trade 24/7, including weekends and public holidays.',
      'Forex and other real-world markets follow their underlying exchange hours.',
    ],
  },
  'trading-terms-glossary': {
    title: 'Glossary',
    lead: 'Plain-English definitions of the terms you will meet while trading.',
    body: [
      'Ask price: the price at which you can buy an asset.',
      'Bid price: the price at which you can sell an asset.',
      'Spread: the difference between the bid and the ask price.',
      'Leverage: trading with borrowed money, which magnifies both gains and losses.',
      'Pip: the smallest standard price movement in a currency pair.',
    ],
  },
  'trade/cfds': {
    title: 'CFDs',
    lead: 'Trade contracts for difference with leverage and capped downside.',
    body: [
      'A contract for difference lets you speculate on the price of an asset without owning it.',
      'You can go long or short, and your profit or loss is the difference between the entry and exit price.',
      'CFDs are complex instruments and carry a high risk of losing money rapidly due to leverage.',
    ],
  },
  'trade/options': {
    title: 'Options',
    lead: 'Predict the market and know your maximum risk upfront.',
    body: [
      'With options, you pay a stake and receive a fixed payout if your prediction is correct.',
      'The most you can lose is the stake you put in — your risk is always known before you trade.',
      'Choose from a wide range of trade types on exclusive Derived Indices and traditional markets.',
    ],
  },
  'trading-app-mobile': {
    title: 'Deriv App',
    lead: 'Manage accounts, transfer funds, and access markets anytime, anywhere.',
    body: [
      'Trade on the go with the Deriv App for Android and iOS.',
      'Switch between accounts, deposit and withdraw, and access all of your markets from one place.',
      'Scan to download from your platform’s app store.',
    ],
  },
  p2p: {
    title: 'Deriv P2P',
    lead: 'Buy and sell with other traders directly.',
    body: [
      'Deriv P2P lets you exchange currencies and funds with other traders, on your own terms.',
      'Choose from a range of payment methods and competitive offers.',
      'Every trade is covered by our escrow and dispute resolution process.',
    ],
  },
  derivlife: {
    title: 'Deriv Life',
    lead: 'Stories, culture, and life behind Deriv.',
    body: [
      'Meet the people who build Deriv and the communities we serve around the world.',
      'Explore our culture, our offices, and our commitment to doing things the right way.',
    ],
  },
  newsroom: {
    title: 'Newsroom',
    lead: 'The latest news, updates, and press releases from Deriv.',
    body: [
      'Read our latest announcements, product updates, and press coverage.',
      'For media enquiries, please contact our press team.',
    ],
  },
  'contact-us': {
    title: 'Contact us',
    lead: 'We are here to help, 24/7.',
    body: [
      'Chat with our support team live from your account, any time of day or night.',
      'Email us and we will get back to you as quickly as we can.',
      'Find answers instantly in our help centre.',
    ],
  },
  partners: {
    title: 'Partners',
    lead: 'Grow your business with Deriv’s partner programmes.',
    body: [
      'Become an affiliate or introducing broker and earn revenue share on your referrals.',
      'Get access to marketing tools, a dedicated partner dashboard, and dedicated support.',
      'Join a global partner network built on 25+ years of trading expertise.',
    ],
  },
};

export function ContentPage({ slug }) {
  const c = CONTENT[slug];
  if (!c) return <NotFound />;
  return (
    <>
      <section className="page-hero">
        <div className="container">
          {crumbs([{ label: 'Home', to: '/' }, { label: c.title }])}
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          {c.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <div style={{ marginTop: 30 }}>
            <Link to="/signup" className="button coral_primary">
              <span className="label">Open account</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export function NotFound() {
  return (
    <section className="section" style={{ textAlign: 'center', padding: '120px 0' }}>
      <div className="container">
        <h1 style={{ fontSize: 64, margin: 0 }}>404</h1>
        <p style={{ fontSize: 18, color: 'var(--ink-2)' }}>We couldn’t find that page.</p>
        <Link to="/" className="button coral_primary" style={{ marginTop: 16 }}>
          <span className="label">Back to home</span>
        </Link>
      </div>
    </section>
  );
}

export function ReviewsStrip() {
  return TESTIMONIALS.slice(0, 3);
}
