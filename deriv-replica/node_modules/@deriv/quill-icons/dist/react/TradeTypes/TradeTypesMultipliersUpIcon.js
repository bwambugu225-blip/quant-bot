import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesMultipliersUpIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M24 5.333h-6.666A2.667 2.667 0 0 0 20 8h2.134l-16.8 16.667v2h2L24 9.887V12a2.667 2.667 0 0 0 2.667 2.667V8A2.667 2.667 0 0 0 24 5.333' }),
    React.createElement("path", { fill: '#85ACB0', d: 'm19.334 17.333 7.333 7.334v2h-2l-7.334-7.334zm-12-12 7.333 7.334-2 2-7.333-7.334v-2z' })));
const ForwardRef = forwardRef(TradeTypesMultipliersUpIcon);
export default ForwardRef;
