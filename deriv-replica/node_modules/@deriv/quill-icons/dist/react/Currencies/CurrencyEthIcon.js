import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyEthIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#EBF0F1', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.8, d: 'M15.998 4v16.565l7.497-4.345z' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.45, d: 'M15.998 4 8.5 16.22l7.498 4.35z' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.8, d: 'M15.998 21.968v6.027L23.5 17.616z' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.45, d: 'M15.998 27.995v-6.028L8.5 17.616z' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.6, d: 'm15.998 20.573 7.497-4.353-7.497-3.348z' }),
    React.createElement("path", { fill: '#12100B', fillOpacity: 0.6, d: 'm8.5 16.22 7.498 4.353v-7.701z' })));
const ForwardRef = forwardRef(CurrencyEthIcon);
export default ForwardRef;
