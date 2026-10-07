import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesInsAndOutsStaysInIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M26.667 24v2.667H5.334V24zM13.334 13.333v5.334h-2.667v-5.334zm13.333-8V8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm21.15 9.456 4.717 4.713a2.666 2.666 0 0 1 0 3.772l-4.718 4.714-.01-.01a2.653 2.653 0 0 1 0-3.752l1.56-1.56h-8.032v-2.666h7.921l-1.45-1.45a2.653 2.653 0 0 1 0-3.752zm-11.816 5.21v2.667h-4v-2.666z' })));
const ForwardRef = forwardRef(TradeTypesInsAndOutsStaysInIcon);
export default ForwardRef;
