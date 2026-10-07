import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesUpsAndDownsOnlyUpsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M10.667 24v2.667H8V24zm16-18.667v21.334H24V5.333zM21.333 16v10.667h-2.666V16zM16 21.333v5.334h-2.666v-5.334zm-6.114-2.666-2.667 2.666H5.333v-2.666z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M18.667 5.333H12v.014A2.653 2.653 0 0 0 14.653 8h2.134l-6.12 6.115v3.77l8-8v2.134a2.653 2.653 0 0 0 2.653 2.648h.014V8a2.667 2.667 0 0 0-2.667-2.667' })));
const ForwardRef = forwardRef(TradeTypesUpsAndDownsOnlyUpsIcon);
export default ForwardRef;
