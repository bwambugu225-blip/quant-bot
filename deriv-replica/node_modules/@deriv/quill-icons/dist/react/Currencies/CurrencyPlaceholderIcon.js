import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyPlaceholderIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("circle", { cx: 16, cy: 16, r: 16, fill: '#000', fillOpacity: 0.08 })));
const ForwardRef = forwardRef(CurrencyPlaceholderIcon);
export default ForwardRef;
