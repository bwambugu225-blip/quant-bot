import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesHighsAndLowsHigherIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M5.334 18.667h21.333V16H5.334z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M9.334 20v2.115L11.448 20h3.77l-5.332 5.333h-3.22V20zM24 6.667a2.667 2.667 0 0 1 2.667 2.666v5.339h-2.303a2.63 2.63 0 0 1-.364-1.32v-2.133L19.224 16h-3.77l6.666-6.667h-2.133a2.653 2.653 0 0 1-2.653-2.653v-.013z' })));
const ForwardRef = forwardRef(TradeTypesHighsAndLowsHigherIcon);
export default ForwardRef;
