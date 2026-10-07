import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyTrxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#DC062B', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#fff', d: 'M20.473 10.224 8.391 8l6.358 16 8.86-10.794zm-.194.98 1.848 1.756-5.055.915zm-4.305 2.488-5.328-4.419 8.709 1.603zm-.38.782-.868 7.182-4.685-11.788zm.805.381 5.597-1.014-6.42 7.823z' })));
const ForwardRef = forwardRef(CurrencyTrxIcon);
export default ForwardRef;
