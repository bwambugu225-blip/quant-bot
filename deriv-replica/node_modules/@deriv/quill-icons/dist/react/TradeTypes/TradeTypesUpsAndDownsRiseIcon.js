import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsRiseIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M24 5.333h-6.666v.014A2.653 2.653 0 0 0 19.987 8h2.133L10.667 19.448v3.77L24 9.886v2.134a2.653 2.653 0 0 0 2.654 2.648h.013V8A2.667 2.667 0 0 0 24 5.333' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M7.219 26.667H5.333V24h4.553z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsRiseIcon);
export default ForwardRef;
