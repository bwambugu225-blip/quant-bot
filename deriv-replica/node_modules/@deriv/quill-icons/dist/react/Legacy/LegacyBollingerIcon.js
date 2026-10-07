import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBollingerIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M3.415 7.91A21.2 21.2 0 0 1 12.009 6c2.948.028 5.877.679 8.576 1.91a1 1 0 1 0 .83-1.82A23.2 23.2 0 0 0 12.009 4a23.2 23.2 0 0 0-9.424 2.09 1 1 0 0 0 .83 1.82' }),
    React.createElement("path", { fill: '#FF444F', d: 'M3.415 13.91A21.2 21.2 0 0 1 12.009 12c2.948.028 5.877.678 8.576 1.91a1 1 0 1 0 .83-1.82A23.2 23.2 0 0 0 12.009 10a23.2 23.2 0 0 0-9.424 2.09 1 1 0 1 0 .83 1.82' }),
    React.createElement("path", { fill: '#FF6444', d: 'M3.415 19.91A21.2 21.2 0 0 1 12.009 18c2.948.028 5.877.678 8.576 1.91a1 1 0 1 0 .83-1.82A23.2 23.2 0 0 0 12.009 16a23.2 23.2 0 0 0-9.424 2.09 1 1 0 1 0 .83 1.82' })));
const ForwardRef = forwardRef(LegacyBollingerIcon);
export default ForwardRef;
