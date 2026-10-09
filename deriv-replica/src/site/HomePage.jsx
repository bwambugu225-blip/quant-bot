import React from 'react';
import { MARKETS, PLATFORMS, AWARDS, TESTIMONIALS } from './siteData.js';
import { Link } from './router.jsx';
import { ArrowRight, ExternalArrow, Stars } from './icons.jsx';

export function SectionHead({ eyebrow, title, children }) {
  return (
    <div className="section__head">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Hero() {
  const [price, setPrice] = React.useState(1296.42);
  const [dir, setDir] = React.useState('up');
  React.useEffect(() => {
    const id = setInterval(() => {
      setPrice(p => {
        const next = +(p + (Math.random() - 0.49) * 0.8).toFixed(2);
        setDir(next >= p ? 'up' : 'down');
        return next;
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__content">
            <div className="hero__body">
              <div className="hero__text">
                <p className="hero__subtitle">Trading for</p>
                <h1 className="hero__title">
                  <span>Anyone</span>
                  <span>Anywhere</span>
                  <span>Anytime</span>
                </h1>
                <p className="hero__description">
                  Widest range of products, markets, platforms with 24/7 customer support.
                </p>
              </div>
              <div className="hero__buttons">
                <Link to="/signup" className="button coral_primary button--lg">
                  <span className="label">Open account</span>
                </Link>
                <Link to="/markets/derived-indices" className="button white_secondary button--lg">
                  <span className="label">Explore markets</span>
                </Link>
              </div>
              <p className="hero__support">No credit card required. Practise with a free demo account.</p>
            </div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <svg className="hero__spark" viewBox="0 0 600 260" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff444f" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff444f" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 200 L40 180 L80 190 L120 150 L160 165 L200 120 L240 140 L280 95 L320 115 L360 70 L400 90 L440 55 L480 75 L520 40 L560 60 L600 24 L600 260 L0 260 Z"
                fill="url(#sparkFill)"
              />
              <path
                d="M0 200 L40 180 L80 190 L120 150 L160 165 L200 120 L240 140 L280 95 L320 115 L360 70 L400 90 L440 55 L480 75 L520 40 L560 60 L600 24"
                fill="none"
                stroke="#ff6b73"
                strokeWidth="2.5"
              />
            </svg>
            <div className="hero__card hero__card--price">
              <div className="label">Volatility 100 Index</div>
              <div className={`value ${dir}`}>{price.toFixed(2)}</div>
            </div>
            <div className="hero__card hero__card--trade">
              <div className="label">Rise · 5 ticks</div>
              <div className="value up" style={{ fontSize: 20 }}>
                +$0.86
              </div>
            </div>
          </div>
        </div>

        <div className="hero__trustpilot">
          <a
            className="trustpilot-badge"
            href="https://www.trustpilot.com/review/deriv.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deriv scores 4.3 out of 5 based on 71,887 reviews — Trustpilot"
          >
            <Stars rating={4.3} />
          </a>
          <span className="hero__trustpilot-text">
            Deriv scores <b>4.3</b> out of 5 based on <b>71,887</b> reviews
          </span>
        </div>
      </section>
    </>
  );
}

export function StatsSection() {
  const stats = [
    { v: '168M+', l: 'Monthly deals' },
    { v: '3M+', l: 'Customers worldwide' },
    { v: '$700B+', l: 'Monthly volume' },
    { v: '1999', l: 'Established since' },
  ];
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="Trusted globally"
          title="Trade with confidence"
        >
          For over 25 years, Deriv Group has been a trusted partner of traders worldwide.
        </SectionHead>
        <div className="stats-v2">
          {stats.map(s => (
            <div className="stat" key={s.l}>
              <div className="stat__value">{s.v}</div>
              <div className="stat__label">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="awards" style={{ marginTop: 48 }}>
          <div className="awards__track">
            {[...AWARDS, ...AWARDS].map((a, i) => (
              <div className="award" key={`${a.title}-${i}`}>
                <span className="award__title">{a.title}</span>
                <span className="award__org">{a.org}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function MarketsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead title="All your markets in one place">
          Trade forex, stocks, commodities, crypto, and our exclusive Derived Indices — all from one account.
        </SectionHead>
        <div className="market-grid">
          {MARKETS.slice(0, 6).map(m => (
            <div className="market-card" key={m.slug}>
              <div className="market-card__icon">{m.name.charAt(0)}</div>
              <h3>{m.name}</h3>
              <p>{m.blurb}</p>
              <Link to={m.slug === 'derived-indices' ? '/markets/derived-indices' : `/markets/${m.slug}`} className="link-arrow">
                Learn more <ArrowRight />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AllDaySection() {
  return (
    <section className="section band-dark">
      <div className="container">
        <div className="section__head" style={{ marginBottom: 0 }}>
          <h2>
            Trade all day
            <br />
            Trade all night
          </h2>
          <p>Cryptocurrencies and our unique Synthetic Indices are available 24/7.</p>
          <div style={{ marginTop: 26 }}>
            <Link to="/signup" className="button coral_primary button--lg">
              <span className="label">Open account</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlatformsSection() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead title="Trade the way you want">
          Powerful platforms for every kind of trader, from automated strategies to professional charting.
        </SectionHead>
        {PLATFORMS.map((p, i) => (
          <div className={`feature-split${i % 2 ? ' feature-split--reverse' : ''}`} key={p.slug} style={{ marginBottom: 64 }}>
            <div className="feature-split__media" aria-hidden="true">
              <span className="chip">{p.tagline}</span>
              <span className="glyph">{p.name.replace('Deriv ', '').slice(0, 2).toUpperCase()}</span>
            </div>
            <div className="feature-split__body">
              <h2>{p.tagline}</h2>
              <p>{p.blurb}</p>
              <Link
                to={p.to || `/trading-platforms/${p.slug}`}
                className="link-arrow"
              >
                Explore {p.name} <ExternalArrow />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function MoneySection() {
  return (
    <section className="section section--alt">
      <div className="container">
        <div className="support-band">
          <div>
            <h2>Your money, your way</h2>
            <p>
              Quick deposits, easy withdrawals, and local payment options mean your money is always accessible.
            </p>
            <Link to="/payment-methods" className="link-arrow">
              Learn more <ArrowRight />
            </Link>
            <p style={{ fontSize: 12.5, marginTop: 18, color: 'var(--ink-3)' }}>
              *Availability of payment methods and processing speeds may vary based on location and selected payment
              option.
            </p>
          </div>
          <div className="support-visual" aria-hidden="true">
            {['Visa', 'Mastercard', 'Skrill', 'Neteller', 'Perfect Money', 'Bank wire'].map(m => (
              <div className="support-bubble" key={m}>
                <b>Payment method</b>
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SupportSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="support-band">
          <div className="support-visual" aria-hidden="true">
            <div className="support-bubble">
              <b>You</b>How do I withdraw my funds?
            </div>
            <div className="support-bubble" style={{ background: 'var(--coral-100)', borderColor: 'var(--coral-100)' }}>
              <b>Deriv support</b>Head to your account, choose Withdraw, and pick your preferred method. We’re online
              24/7 if you need a hand.
            </div>
          </div>
          <div>
            <h2>Get answers when you need</h2>
            <p>
              We don’t have opening or closing hours. That means you can speak to our Support whenever you need, wherever
              you are.
            </p>
            <Link to="/help-centre" className="link-arrow">
              Visit the help centre <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const [page, setPage] = React.useState(0);
  const perPage = 3;
  const pages = Math.ceil(TESTIMONIALS.length / perPage);
  React.useEffect(() => {
    const id = setInterval(() => setPage(p => (p + 1) % pages), 6000);
    return () => clearInterval(id);
  }, [pages]);

  return (
    <section className="section section--alt testimonial">
      <div className="container">
        <SectionHead title="What our customers say">Rated 4.3 out of 5 on Trustpilot by 71,887 reviewers.</SectionHead>
        <div style={{ overflow: 'hidden' }}>
          <div
            className="testimonial__track"
            style={{ transform: `translateX(calc(-${page} * (100% / ${perPage})))` }}
          >
            {TESTIMONIALS.map(t => (
              <div className="testimonial__card" key={t.name}>
                <Stars rating={5} />
                <p className="testimonial__quote">“{t.quote}”</p>
                <div className="testimonial__who">
                  <div className="testimonial__avatar">{t.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <b>{t.name}</b>
                    <span>Verified Deriv customer</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="testimonial__nav">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`testimonial__dot${i === page ? ' active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export function StepsSection() {
  const steps = [
    { n: 1, t: 'Sign up', d: 'Sign up in minutes. Practise with a zero-risk demo account.' },
    { n: 2, t: 'Deposit', d: 'Use your favourite local payment method to fund your account.' },
    { n: 3, t: 'Trade', d: 'Start your trading journey.' },
  ];
  return (
    <section className="section">
      <div className="container">
        <SectionHead title="Get started in 3 simple steps" />
        <div className="steps">
          {steps.map(s => (
            <div className="step" key={s.n}>
              <div className="step__num">{s.n}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function JoinCta() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="cta-band">
          <h2>Join 3M+ global traders</h2>
          <p>
            Open an account in minutes and start trading the world’s markets — forex, stocks, indices, and more.
          </p>
          <Link to="/signup" className="button white_secondary button--lg">
            <span className="label">Open account</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <MarketsSection />
      <AllDaySection />
      <PlatformsSection />
      <MoneySection />
      <SupportSection />
      <TestimonialsSection />
      <StepsSection />
      <JoinCta />
    </>
  );
}
