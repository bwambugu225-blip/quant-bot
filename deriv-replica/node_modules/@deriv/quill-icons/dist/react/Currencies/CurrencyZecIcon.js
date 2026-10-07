import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyZecIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#F4B728', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#231F20', d: 'M13.155 19.73v-1.223l3.392-4.598h-3.392v-1.62h2.187V10.95h1.344v1.337h2.186v1.223l-3.392 4.601h3.392v1.618h-2.186v1.34h-1.344v-1.34z' }),
    React.createElement("path", { fill: '#231F20', fillRule: 'evenodd', d: 'M8 16c0-4.412 3.588-8 8-8s8 3.588 8 8-3.588 8-8 8-8-3.588-8-8m1.32 0A6.686 6.686 0 0 0 16 22.68 6.686 6.686 0 0 0 22.68 16 6.686 6.686 0 0 0 16 9.32 6.686 6.686 0 0 0 9.32 16', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(CurrencyZecIcon);
export default ForwardRef;
