import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesHighsAndLowsHighIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 24v2.667H5.334V24zm0-18.667V8H16l2.667-2.667zm-13.333 0L16 8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M26.654 12A2.653 2.653 0 0 0 24 14.653v2.133l-6.114-6.12a2.667 2.667 0 0 0-3.771 0L8 16.782l-2.666-2.666v3.77l.78.781a2.667 2.667 0 0 0 3.772 0L16 12.552l6.115 6.115h-2.133a2.653 2.653 0 0 0-2.648 2.653v.013H24a2.667 2.667 0 0 0 2.667-2.666V12z' })));
const ForwardRef = forwardRef(TradeTypesHighsAndLowsHighIcon);
export default ForwardRef;
