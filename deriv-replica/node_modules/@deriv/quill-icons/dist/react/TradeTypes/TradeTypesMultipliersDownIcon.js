import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesMultipliersDownIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M24 26.667h-6.666A2.667 2.667 0 0 1 20 24h2.134L5.334 7.333v-2h2L24 22.113V20a2.667 2.667 0 0 1 2.667-2.667V24A2.667 2.667 0 0 1 24 26.667' }),
    React.createElement("path", { fill: '#85ACB0', d: 'm12.667 17.333 2 2-7.333 7.334h-2v-2zm14-12v2l-7.334 7.334-2-2 7.334-7.334z' })));
const ForwardRef = forwardRef(TradeTypesMultipliersDownIcon);
export default ForwardRef;
