import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsResetUpIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M10.667 24v2.667H5.334V24zm16 0v2.667h-8V24zM16 5.333v21.334h-2.666V5.333zm-5.333 0V8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M13.334 16.781v3.771l-.782.781H5.334v-2.666h6.114zM24 5.333A2.667 2.667 0 0 1 26.667 8v6.667h-.014A2.653 2.653 0 0 1 24 12.019V9.885l-6.666 6.667v-3.77L22.12 8h-2.133a2.653 2.653 0 0 1-2.653-2.653v-.014z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsResetUpIcon);
export default ForwardRef;
