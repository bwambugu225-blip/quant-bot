import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesDigitsUnderIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'm16 12.76 8 8.027V17.32a2.653 2.653 0 0 1 2.654-2.653h.013v8A2.667 2.667 0 0 1 24 25.333h-8v-.013a2.653 2.653 0 0 1 2.654-2.653h3.46L16 16.552zM9.932 6.667l2.654 2.666H8.782L6.115 6.667z' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 9.333H5.334V12h21.333z' })));
const ForwardRef = forwardRef(TradeTypesDigitsUnderIcon);
export default ForwardRef;
