import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyRateOfChangeIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#D6DADB', d: 'M3 9h18a1 1 0 1 0 0-2H3a1 1 0 0 0 0 2' }),
    React.createElement("path", { fill: '#85ACB0', d: 'm7.349 6.065 2.666 15.109c.185 1.049 1.663 1.12 1.948.094L16.34 5.51l1.802 3.004A1 1 0 0 0 19 9h2a1 1 0 1 0 0-2h-1.434l-2.708-4.514c-.453-.754-1.586-.6-1.822.246L11.219 16.48 8.985 3.826a1 1 0 0 0-1.692-.533L3.586 7H3a1 1 0 0 0 0 2h1a1 1 0 0 0 .707-.293z' })));
const ForwardRef = forwardRef(LegacyRateOfChangeIcon);
export default ForwardRef;
