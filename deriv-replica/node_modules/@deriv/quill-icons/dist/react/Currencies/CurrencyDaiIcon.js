import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyDaiIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FCE6C5', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#FFCC80', d: 'M6 16h10v10z' }),
    React.createElement("path", { fill: '#FFB74D', d: 'M16 6v13L6 16z' }),
    React.createElement("path", { fill: '#fff', d: 'm9 16 7-7v4l-3 3z' }),
    React.createElement("path", { fill: '#F7C57B', d: 'M26 16H16v10z' }),
    React.createElement("path", { fill: '#F7B14A', d: 'M16 6v13l10-3z' }),
    React.createElement("path", { fill: '#fff', d: 'm23 16-7-7v4l3 3z' })));
const ForwardRef = forwardRef(CurrencyDaiIcon);
export default ForwardRef;
