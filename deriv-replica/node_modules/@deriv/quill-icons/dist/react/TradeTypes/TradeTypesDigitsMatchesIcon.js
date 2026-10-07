import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesDigitsMatchesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'm10.01 8.457 5.654 5.658a2.667 2.667 0 0 1 0 3.77l-5.656 5.658-.008-.01a2.65 2.65 0 0 1 0-3.752l2.445-2.448-7.111.016v-2.682h7.111L10 12.22a2.65 2.65 0 0 1 0-3.753zm11.98 0 .01.01a2.65 2.65 0 0 1 0 3.752l-2.445 2.448 7.112-.016v2.682h-7.112l2.447 2.447a2.65 2.65 0 0 1 0 3.753l-.01.01-4.658-4.659.997-.999a2.667 2.667 0 0 0 0-3.77l-.997-.999z' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M17.334 21.333v5.334h-2.667v-5.334zm0-16v5.334h-2.667V5.333z' })));
const ForwardRef = forwardRef(TradeTypesDigitsMatchesIcon);
export default ForwardRef;
