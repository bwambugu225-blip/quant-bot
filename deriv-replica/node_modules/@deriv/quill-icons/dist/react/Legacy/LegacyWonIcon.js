import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyWonIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, fill: '#4BB4B3', rx: 8 }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M11.146 5.146a.5.5 0 0 1 .708.708l-5 5a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L6.5 9.793z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyWonIcon);
export default ForwardRef;
