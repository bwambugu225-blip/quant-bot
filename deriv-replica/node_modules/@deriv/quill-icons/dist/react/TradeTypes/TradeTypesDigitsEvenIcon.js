import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesDigitsEvenIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M13.334 18.667v8h-8v-8zM26.667 5.333v8h-8v-8z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M26.667 18.667v8h-8v-8zM13.334 5.333v8h-8v-8z' })));
const ForwardRef = forwardRef(TradeTypesDigitsEvenIcon);
export default ForwardRef;
