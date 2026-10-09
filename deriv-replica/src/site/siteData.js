// Navigation, footer and page content transcribed from deriv.com.
// Kept as data so the Nav/Footer/route components stay presentational.

export const MEGA_MENUS = {
  Trading: [
    {
      title: 'Trade',
      links: [
        { label: 'CFDs', to: '/trade/cfds' },
        { label: 'Options', to: '/trade/options' },
        { label: 'Trading specifications', to: '/trading-specifications' },
      ],
    },
    {
      title: 'Markets',
      links: [
        { label: 'Forex', to: '/markets/forex' },
        { label: 'Derived Indices', to: '/markets/derived-indices' },
        { label: 'Stocks', to: '/markets/stocks' },
        { label: 'Stock Indices', to: '/markets/stock-indices' },
        { label: 'Commodities', to: '/markets/commodities' },
        { label: 'Cryptocurrencies', to: '/markets/cryptocurrencies' },
        { label: 'ETFs', to: '/markets/etfs' },
      ],
    },
    {
      title: 'Promotions & tools',
      links: [
        { label: 'Promotions', to: '/promotions' },
        { label: 'Trading competitions', to: '/trading-competitions' },
        { label: 'Spread advantage hours', to: '/spread-advantage-hours' },
        { label: 'MT5 signals', to: '/mt5-trading-signals' },
        { label: 'Trading calculator', to: '/trading-calculators' },
        { label: 'Payment methods', to: '/payment-methods' },
      ],
    },
  ],
  Platforms: [
    {
      title: 'Trading platforms',
      links: [
        { label: 'Deriv Trader', to: '/trading-platforms/deriv-trader' },
        { label: 'Deriv MT5', to: '/trading-platforms/deriv-mt5' },
        { label: 'Deriv cTrader', to: '/trading-platforms/deriv-ctrader' },
        { label: 'Deriv Exchange', to: '/trading-platforms/deriv-exchange' },
        { label: 'Deriv Bot', to: '/trading-platforms/deriv-bot' },
        { label: 'TradingView', to: '/trading-platforms/tradingview' },
      ],
    },
    {
      title: 'Apps & social',
      links: [
        { label: 'Deriv App', to: '/trading-app-mobile' },
        { label: 'Deriv P2P', to: '/p2p' },
        { label: 'SmartTrader', to: 'https://dsmarttrader.deriv.com/' },
        { label: 'TradersView', to: 'https://tradersview.deriv.com/' },
      ],
    },
    {
      title: 'Developer tools',
      links: [{ label: 'Deriv API', to: 'https://developers.deriv.com/' }],
    },
  ],
  About: [
    {
      title: 'Company',
      links: [
        { label: 'Who we are', to: '/who-we-are' },
        { label: 'Why choose us', to: '/why-choose-us' },
        { label: 'Our principles', to: '/our-principles' },
        { label: 'Regulatory information', to: '/regulatory' },
        { label: 'Careers', to: 'https://careers.deriv.com/' },
      ],
    },
    {
      title: 'Media',
      links: [
        { label: 'Deriv<ed>', to: 'https://derivai.substack.com/' },
        { label: 'Deriv Life', to: '/derivlife' },
        { label: 'Newsroom', to: '/newsroom' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms & conditions', to: '/terms-and-conditions' },
        { label: 'Privacy policy', to: '/privacy-policy' },
        { label: 'Responsible trading', to: '/responsible' },
        { label: 'Fraud prevention', to: '/fraud-prevention' },
      ],
    },
  ],
  'Learning & support': [
    {
      title: 'Learn',
      links: [
        { label: 'Deriv Academy', to: 'https://traders-academy.deriv.com' },
        { label: 'Expert Insights', to: 'https://experts.deriv.com/insights/' },
        { label: 'Deriv Blog', to: 'https://blog.deriv.com' },
        { label: 'Glossary', to: '/trading-terms-glossary' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help centre', to: '/help-centre' },
        { label: 'Contact us', to: '/contact-us' },
        { label: 'Community', to: 'https://community.deriv.com/' },
        { label: 'Status page', to: 'https://status.deriv.systems/' },
      ],
    },
    {
      title: 'Partners',
      links: [
        { label: 'Partners', to: '/partners' },
        { label: 'API partnerships', to: 'https://developers.deriv.com/' },
      ],
    },
  ],
};

export const FOOTER_COLS = [
  {
    title: 'Trade',
    links: [
      { label: 'CFDs', to: '/trade/cfds' },
      { label: 'Options', to: '/trade/options' },
      { label: 'Trading specifications', to: '/trading-specifications' },
    ],
  },
  {
    title: 'Markets',
    links: [
      { label: 'Forex', to: '/markets/forex' },
      { label: 'Derived Indices', to: '/markets/derived-indices' },
      { label: 'Stocks', to: '/markets/stocks' },
      { label: 'Stock Indices', to: '/markets/stock-indices' },
      { label: 'Commodities', to: '/markets/commodities' },
      { label: 'Cryptocurrencies', to: '/markets/cryptocurrencies' },
      { label: 'ETFs', to: '/markets/etfs' },
    ],
  },
  {
    title: 'Platforms',
    links: [
      { label: 'Deriv App', to: '/trading-app-mobile' },
      { label: 'TradingView', to: '/trading-platforms/tradingview' },
      { label: 'Deriv Exchange', to: '/trading-platforms/deriv-exchange' },
      { label: 'Deriv MT5', to: '/trading-platforms/deriv-mt5' },
      { label: 'Deriv cTrader', to: '/trading-platforms/deriv-ctrader' },
      { label: 'Deriv Trader', to: '/trading-platforms/deriv-trader' },
      { label: 'Deriv Bot', to: '/trading-platforms/deriv-bot' },
      { label: 'Deriv P2P', to: '/p2p' },
    ],
  },
  {
    title: 'Promotions & tools',
    links: [
      { label: 'Promotions', to: '/promotions' },
      { label: 'Trading competitions', to: '/trading-competitions' },
      { label: 'Spread advantage hours', to: '/spread-advantage-hours' },
      { label: 'MT5 signals', to: '/mt5-trading-signals' },
      { label: 'Trading calculator', to: '/trading-calculators' },
    ],
  },
  {
    title: 'About',
    links: [
      { label: 'Who we are', to: '/who-we-are' },
      { label: 'Why choose us', to: '/why-choose-us' },
      { label: 'Our principles', to: '/our-principles' },
      { label: 'Deriv Life', to: '/derivlife' },
      { label: 'Newsroom', to: '/newsroom' },
      { label: 'Regulatory information', to: '/regulatory' },
    ],
  },
  {
    title: 'Learn & support',
    links: [
      { label: 'Deriv Academy', to: 'https://traders-academy.deriv.com' },
      { label: 'Deriv Blog', to: 'https://blog.deriv.com' },
      { label: 'Glossary', to: '/trading-terms-glossary' },
      { label: 'Help centre', to: '/help-centre' },
      { label: 'Contact us', to: '/contact-us' },
      { label: 'Payment methods', to: '/payment-methods' },
    ],
  },
];

export const LEGAL_ENTITIES = [
  'Deriv (FX) Ltd is licensed and regulated by the Labuan Financial Services Authority.',
  'Deriv (BVI) Ltd is licensed and regulated by the British Virgin Islands Financial Services Commission.',
  'Deriv Investments (Cayman) Limited, registered office at Campbells Corporate Services Limited, Floor 4, Willow House, Cricket Square, Grand Cayman, Cayman Islands, is regulated by the Cayman Islands Monetary Authority.',
  'Deriv (Mauritius) Ltd is regulated by the Financial Services Commission, Mauritius.',
  'Deriv (V) Ltd is licensed and regulated by the Vanuatu Financial Services Commission.',
  'Deriv.com Limited, a company registered in Guernsey, is the holding company for these entities.',
  'Deriv Capital International Ltd has a registered office at Unit 25, 2nd Floor, Nia Mall, Saleufi Street, Apia, Samoa.',
  'Deriv (SVG) LLC has a registered office at First Floor, SVG Teachers Credit Union Uptown Building, Corner of James and Middle Street, Kingstown P.O., St Vincent and the Grenadines.',
];

export const MARKETS = [
  {
    slug: 'forex',
    name: 'Forex',
    blurb: 'Trade the most popular currency pairs with high leverage, tight spreads, and fast execution.',
    intro:
      'Trade the world\u2019s most liquid market around the clock from Monday to Friday. Go long or short on major, minor, and exotic currency pairs with competitive spreads and fast execution.',
    points: ['Major, minor and exotic pairs', 'Leverage with capped downside', 'Spreads from 0.5 pips'],
  },
  {
    slug: 'derived-indices',
    name: 'Derived Indices',
    blurb: 'Trade 24/7 on exclusive Synthetic and Derived Indices. Choose volatility levels that match your strategy.',
    intro:
      'Our exclusive Derived Indices are available 24/7, 365 days a year. Because they are generated by a cryptographically secure random number generator, they are not affected by real-world events.',
    points: ['Volatility, Crash/Boom, Step and Range Break indices', 'Trade 24/7, including weekends', 'Simulated, event-free markets'],
  },
  {
    slug: 'stocks',
    name: 'Stocks',
    blurb: 'Trade global market leaders like Apple, Tesla, and NVIDIA.',
    intro:
      'Trade the shares of the world\u2019s biggest companies with a derivative that lets you go long or short without ever owning the underlying stock.',
    points: ['Global blue-chip companies', 'Commission-free CFDs', 'Go long or short'],
  },
  {
    slug: 'stock-indices',
    name: 'Stock Indices',
    blurb: 'Trade offerings that track the top global stock indices.',
    intro:
      'Speculate on baskets of the largest listed companies in a single trade. Our stock index offerings track the performance of major global benchmarks.',
    points: ['Major benchmarks in one trade', 'Tight spreads', 'Hedging and diversification'],
  },
  {
    slug: 'commodities',
    name: 'Commodities',
    blurb: 'Trade gold, silver, oil, natural gas, sugar, and more with competitive leverage and tight spreads.',
    intro:
      'Trade energies, metals, and agriculture with a derivative that tracks the underlying commodity price and never expires on you.',
    points: ['Metals, energies and agriculture', 'Competitive leverage', 'No overnight charges'],
  },
  {
    slug: 'cryptocurrencies',
    name: 'Cryptocurrencies',
    blurb: 'Trade round the clock on the volatility of cryptocurrencies like Bitcoin and Ethereum.',
    intro:
      'Speculate on the price of the most traded cryptocurrencies with a derivative that lets you go long or short, with no wallet and no exchange account.',
    points: ['BTC, ETH and more', '24/7 markets', 'No crypto wallet required'],
  },
  {
    slug: 'etfs',
    name: 'ETFs',
    blurb: 'Trade a basket of assets in a single position with exchange-traded funds.',
    intro:
      'Exchange-traded funds let you take a position in a diversified basket of assets through one trade, with the flexibility to go long or short.',
    points: ['Diversified in one trade', 'Low entry cost', 'Transparent pricing'],
  },
];

export const PLATFORMS = [
  {
    slug: 'deriv-trader',
    name: 'Deriv Trader',
    tagline: 'Optimised payouts, limited downsides',
    blurb:
      'On Deriv Trader, you\u2019ll never lose more than you put in. Know your maximum risk upfront when trading global markets and round-the-clock indices.',
    to: '/trader',
  },
  {
    slug: 'deriv-mt5',
    name: 'Deriv MT5',
    tagline: 'Power of MT5 with exclusive indices',
    blurb:
      'Deriv MT5 brings you the world\u2019s favourite platform with the widest range of forex, stocks, commodities, cryptocurrencies, and exclusive Derived Indices with zero commissions, tight spreads, and swap-free trading.',
  },
  {
    slug: 'deriv-ctrader',
    name: 'Deriv cTrader',
    tagline: 'Copy expert traders',
    blurb:
      'On Deriv cTrader, tap into the expertise of seasoned traders. Follow their strategies, and mirror their trades automatically.',
  },
  {
    slug: 'deriv-exchange',
    name: 'Deriv Exchange',
    tagline: 'Buy and sell crypto in seconds',
    blurb:
      'Trade crypto on spot and futures markets around the clock with 25+ years of trust, transparent fees, and quick withdrawals.',
  },
  {
    slug: 'deriv-bot',
    name: 'Deriv Bot',
    tagline: 'Automate your trades',
    blurb:
      'Deriv Bot keeps your strategies running on 24/7 exclusive indices and traditional markets. Trade with predetermined risk \u2014 no surprises, no coding required.',
  },
  {
    slug: 'tradingview',
    name: 'TradingView',
    tagline: 'World-class charts, 24/7 trading',
    blurb:
      "Analyse markets with 400+ indicators, 17 chart types, and powerful drawing tools with TradingView. Trade with the world's most popular charting platform on global financial markets and our exclusive 24/7 Derived Indices.",
  },
];

export const AWARDS = [
  { title: 'Best Trade Execution Award (MEA)', org: 'Ultimate Fintech 2026' },
  { title: 'Best Trading Experience - Global', org: 'Ultimate Fintech 2025' },
  { title: 'Best Broker - Africa', org: 'Global Forex Awards 2025' },
  { title: 'Best Trading Conditions - Global', org: 'Finance Magnates 2025' },
];

export const TESTIMONIALS = [
  {
    quote:
      'Trading with Deriv has been great. It has beautiful low spreads and there are options where you can choose the best or suitable trading account. Also, withdrawals on the same day are fantastic. Deriv is the best broker. Please keep it up.',
    name: 'Tshepang Israel Phake',
  },
  {
    quote:
      'Deriv is an easy and smooth trading experience, better than any other platform. Also, the peer-to-peer transaction, I find it revolutionary and the best for us traders in third-world countries.',
    name: 'tinashe kurebwaseka',
  },
  {
    quote:
      'Deriv is the best trading platform. I never had difficulty in trading for more than 5 years. Thank you Deriv for your present in trading world.',
    name: 'ezra hutabarat',
  },
  {
    quote:
      "I'm happy with the service provided. Deriv always updates me on what's happening and gives daily statements of accounts. And the staff is very responsive and always ready to assist.",
    name: 'Wandile S\u2019busiso Ninela',
  },
  {
    quote:
      'Deriv is by far the best binary options brokerage. It has over 5 different types of binary options unlike other brokers. The payments are fast and it\u2019s really amazing. Thanks Deriv.',
    name: 'philip sserugunda',
  },
  {
    quote: 'Superb support. No hassle at all with withdrawals. Perfect trading conditions. Everything a trader could look for!',
    name: 'Jolin Jantjies',
  },
  {
    quote:
      "I have been trading with Deriv for some years and I haven't encountered any problems with it. Deposits and withdrawals are smooth. I have recommended it to many people.",
    name: 'Loide Simaneka Shikwambi Ekand',
  },
];
