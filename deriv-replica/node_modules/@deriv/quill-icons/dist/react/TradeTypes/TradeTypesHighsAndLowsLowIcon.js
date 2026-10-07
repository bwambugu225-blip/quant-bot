import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesHighsAndLowsLowIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 24v2.667h-8L16 24zM16 24l-2.666 2.667h-8V24zM26.667 5.333V8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M24 10.667h-6.666v.013a2.653 2.653 0 0 0 2.653 2.653h2.133L16 19.448l-6.114-6.115a2.667 2.667 0 0 0-3.771 0l-.782.782v3.77L8 15.22l6.115 6.114a2.667 2.667 0 0 0 3.77 0L24 15.22v2.133A2.653 2.653 0 0 0 26.654 20h.013v-6.667A2.667 2.667 0 0 0 24 10.667' })));
const ForwardRef = forwardRef(TradeTypesHighsAndLowsLowIcon);
export default ForwardRef;
