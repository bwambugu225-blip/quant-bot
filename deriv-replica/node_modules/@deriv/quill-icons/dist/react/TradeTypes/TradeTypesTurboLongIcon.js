import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesTurboLongIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M26.667 5.333v8h-1.334C24.6 13.333 24 12.733 24 12V9.893l-9.333 9.32-4-4-5.333 5.334v-3.76l5.333-5.334 4 4L22.107 8H20c-.733 0-1.333-.6-1.333-1.333V5.333z' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 22.667v4h-5.334l-.893-1.334H5.334V24H20.44l.893-1.333z' })));
const ForwardRef = forwardRef(TradeTypesTurboLongIcon);
export default ForwardRef;
