import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsAsianUpIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 24v2.667H5.334V24zm0-8v2.667H5.334V16zM16 8v2.667H5.334V8z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm13.886 20-4 4H6.115l4-4zM24 5.333A2.667 2.667 0 0 1 26.667 8v6.667h-.013A2.653 2.653 0 0 1 24 12.019V9.885L17.886 16H14.12l8-8h-2.133a2.653 2.653 0 0 1-2.653-2.653v-.014z' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsAsianUpIcon);
export default ForwardRef;
