import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesInsAndOutsEndsOutIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 24v2.667H5.334V24zM16 16v2.667H5.334V16zm10.667 0v2.667h-4.115L25.22 16z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm24 10.115-4.39-4.391-.01.01a2.653 2.653 0 0 0 0 3.751l1.181 1.182h-7.447v2.666h7.448L19.6 14.515a2.653 2.653 0 0 0 0 3.752l.01.009 4.39-4.39a2.667 2.667 0 0 0 0-3.771' })));
const ForwardRef = forwardRef(TradeTypesInsAndOutsEndsOutIcon);
export default ForwardRef;
