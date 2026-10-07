import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesDigitsOddIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'm10 17.167 4.667 7H5.334zm12 0 4.667 7h-9.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm11.334 14.833 4.666-7 4.667 7z' })));
const ForwardRef = forwardRef(TradeTypesDigitsOddIcon);
export default ForwardRef;
