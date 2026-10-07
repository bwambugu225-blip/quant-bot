import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyWebsiteIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m-.5 10-2.078.001c.469 1.537 1.267 2.587 2.078 2.901zm3.078.001L8.5 11v2.902c.812-.314 1.61-1.365 2.078-2.9zm2.619 0h-1.582c-.26.957-.64 1.794-1.105 2.452A6.03 6.03 0 0 0 13.197 11zm-8.812 0H2.803a6.03 6.03 0 0 0 2.687 2.45c-.466-.656-.846-1.493-1.105-2.45M2.087 6.973l-.002.017A6.04 6.04 0 0 0 2.342 10h1.824a12.3 12.3 0 0 1-.126-3H2.25a.5.5 0 0 1-.163-.027m5.413.026H5.043a11.5 11.5 0 0 0 .136 3.002L7.5 10zm3.457 0H8.5V10h2.321c.177-.99.222-1.998.136-3zm2.955-.028-.072.02a.5.5 0 0 1-.09.009h-1.79c.08 1.002.038 2.01-.126 3.002h1.824a6 6 0 0 0 .254-3.03zM5.49 2.547l-.02.01A6.02 6.02 0 0 0 2.342 6h1.824c.234-1.377.703-2.575 1.325-3.453zm2.01-.45C6.523 2.476 5.565 3.923 5.18 6l2.32-.001zm3.01.451.055.08c.595.87 1.043 2.037 1.27 3.371h1.824a6.02 6.02 0 0 0-3.15-3.45zm-2.01-.45V6h2.321c-.386-2.076-1.343-3.523-2.32-3.9z' })));
const ForwardRef = forwardRef(LegacyWebsiteIcon);
export default ForwardRef;
