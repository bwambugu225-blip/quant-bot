import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyZigZagIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'm5.064 2.649-3 8a1 1 0 0 0 1.872.702l3-8a1 1 0 0 0-1.872-.702' }),
    React.createElement("path", { fill: '#85ACB0', d: 'm18.832 20.445-12-18a1 1 0 0 0-1.664 1.11l12 18a1 1 0 0 0 1.664-1.11' }),
    React.createElement("path", { fill: '#FF444F', d: 'm20.143 15.486-3 5a1 1 0 0 0 1.715 1.029l3-5a1 1 0 0 0-1.716-1.03' })));
const ForwardRef = forwardRef(LegacyZigZagIcon);
export default ForwardRef;
