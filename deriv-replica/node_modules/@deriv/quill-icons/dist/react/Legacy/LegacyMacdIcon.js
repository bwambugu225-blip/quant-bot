import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyMacdIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M6 19v3H3v-3zm8-3v3h-3v-3zm4-4v6h-3v-6zm3-10a1 1 0 1 1 0 2h-4.616l-9.715 8.743A1 1 0 0 1 6 13H3a1 1 0 1 1 0-2h2.616l9.715-8.743A1 1 0 0 1 16 2z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M10 18v2H7v-2zM21 5a1 1 0 1 1 0 2h-2.613L7.673 16.74A1 1 0 0 1 7 17H3a1 1 0 1 1 0-2h3.613l10.714-9.74A1 1 0 0 1 18 5zm1 3v9h-3V8z' })));
const ForwardRef = forwardRef(LegacyMacdIcon);
export default ForwardRef;
