import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsResetDownIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M16 5.333v21.334h-2.666V5.333zM10.667 24v2.667H5.334V24zm0-18.667V8H5.334V5.333zm16 0V8h-8V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M17.334 15.453 24 22.12v-2.133a2.653 2.653 0 0 1 2.654-2.654h.013V24A2.667 2.667 0 0 1 24 26.667h-6.666v-.014A2.653 2.653 0 0 1 19.982 24h2.133l-4.781-4.776zm-4.782-4.786.782.781v3.77l-1.886-1.885H5.333v-2.666z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsResetDownIcon);
export default ForwardRef;
