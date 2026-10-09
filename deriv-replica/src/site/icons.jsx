import React from 'react';
import logoUrl from './assets/deriv-logo.svg';

export function DerivLogo({ className = 'navbar__logo' }) {
  return (
    <a href="/" className={className} aria-label="Home">
      <img src={logoUrl} alt="Logo" />
    </a>
  );
}

export const Chevron = ({ size = 14 }) => (
  <svg className="navbar__nav-item__chevron" width={size} height={size} viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M2.625 4.8125L7 9.1875L11.375 4.8125" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 8h9M8 3.5 12.5 8 8 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ExternalArrow = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Globe = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 16 24" fill="none" aria-hidden="true" className="navbar__lang-globe">
    <path
      d="M8 20C5.125 20 2.5 18.5 1.0625 16C-0.375 13.5312 -0.375 10.5 1.0625 8C2.5 5.53125 5.125 4 8 4C10.8438 4 13.4688 5.53125 14.9062 8C16.3438 10.5 16.3438 13.5312 14.9062 16C13.4688 18.5 10.8438 20 8 20ZM5.5625 13.5H10.4062C10.4688 13.0312 10.5 12.5312 10.5 12C10.5 11.5 10.4688 11 10.4062 10.5H5.5625C5.5 11 5.5 11.5 5.5 12C5.5 12.5312 5.5 13.0312 5.5625 13.5ZM5.8125 9H10.1562C10 8.25 9.75 7.59375 9.46875 7.03125C8.84375 5.75 8.21875 5.5 8 5.5C7.75 5.5 7.15625 5.75 6.5 7.03125C6.21875 7.59375 6 8.25 5.8125 9Z"
      fill="currentColor"
    />
  </svg>
);

export const Hamburger = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="M2.5 5H17.5M2.5 10H17.5M2.5 15H17.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

export const Star = ({ filled }) => (
  <span className={`tp-star${filled ? ' filled' : ''}`} aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z" />
    </svg>
  </span>
);

export const Stars = ({ rating = 5 }) => (
  <span className="trustpilot-stars" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(i => (
      <Star key={i} filled={i <= Math.round(rating)} />
    ))}
  </span>
);
