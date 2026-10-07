import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyRsiIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'm8.236 4 2.8 10.263A1 1 0 0 0 12 15h5.34l2.74 6.394a1 1 0 1 0 1.84-.788l-3-7A1 1 0 0 0 18 13h-5.236l-2.8-10.263A1 1 0 0 0 9 2H3a1 1 0 0 0 0 2z' }),
    React.createElement("path", { fill: '#D6DADB', d: 'M6 6a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm15 0a1 1 0 1 1 0 2h-7a1 1 0 1 1 0-2z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M3 20h13a1 1 0 1 0 0-2H3a1 1 0 1 0 0 2' })));
const ForwardRef = forwardRef(LegacyRsiIcon);
export default ForwardRef;
