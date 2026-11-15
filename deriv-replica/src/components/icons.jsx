// Inline line icons for the tool rail. Stroked, 1.5px, currentColor — the same
// visual language as the rest of the chrome, so nothing reads as a placeholder.
import React from 'react';

const base = {
  width: 17, height: 17, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round',
};

export function IconChart(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M3 20V4" />
      <path d="M3 20h18" />
      <path d="M7 16l3.5-4.5L14 14l5-7" />
    </svg>
  );
}

export function IconStrategy(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="6" cy="6" r="2.4" />
      <circle cx="18" cy="6" r="2.4" />
      <circle cx="12" cy="18" r="2.4" />
      <path d="M8.4 6h7.2" />
      <path d="M7.2 8.2 10.8 15.8" />
      <path d="M16.8 8.2 13.2 15.8" />
    </svg>
  );
}

export function IconPositions(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h13" />
      <path d="M18 12h2" />
      <path d="M19 18h1" />
    </svg>
  );
}

export function IconReports(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <rect x="4" y="3.5" width="16" height="17" rx="2" />
      <path d="M8 8.5h8" />
      <path d="M8 12h8" />
      <path d="M8 15.5h5" />
    </svg>
  );
}

export function IconLog(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M4 5.5h16" />
      <path d="M4 10h16" />
      <path d="M4 14.5h10" />
      <path d="M4 19h7" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

export function IconChevron(props) {
  return (
    <svg {...base} {...props} aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
