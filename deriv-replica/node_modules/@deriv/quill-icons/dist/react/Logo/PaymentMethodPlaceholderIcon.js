import * as React from 'react';
import { forwardRef } from 'react';
const PaymentMethodPlaceholderIcon = ({ title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 128 80', role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 127, height: 79, x: 0.5, y: 0.5, fill: '#7F0DCF', fillOpacity: 0.08, stroke: '#7F0DCF', strokeDasharray: '2 2', rx: 7.5 })));
const ForwardRef = forwardRef(PaymentMethodPlaceholderIcon);
export default ForwardRef;
