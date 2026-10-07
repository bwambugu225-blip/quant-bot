import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsOnlyDownsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 5.333v21.334H24V5.333zm-5.334 0V16h-2.666V5.333zM7.22 10.667l2.667 2.666H5.334v-2.666zM16 5.333v5.334h-2.666V5.333zm-5.333 0V8H8V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M21.32 17.333a2.653 2.653 0 0 0-2.653 2.654v2.133l-8-8v3.765L16.782 24h-2.129A2.653 2.653 0 0 0 12 26.653v.014h6.667A2.667 2.667 0 0 0 21.333 24v-6.667z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsOnlyDownsIcon);
export default ForwardRef;
