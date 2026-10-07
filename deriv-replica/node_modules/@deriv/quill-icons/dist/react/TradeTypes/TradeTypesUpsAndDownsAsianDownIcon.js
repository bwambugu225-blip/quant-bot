import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsAsianDownIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M16 21.333V24H5.334v-2.667zm10.667-8V16H5.334v-2.667zm0-8V8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M17.886 16 24 22.12v-2.133a2.653 2.653 0 0 1 2.654-2.654h.013V24A2.667 2.667 0 0 1 24 26.667h-6.666v-.014A2.653 2.653 0 0 1 19.982 24h2.133l-8-8zm-8-8 4 4h-3.771l-4-4z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsAsianDownIcon);
export default ForwardRef;
