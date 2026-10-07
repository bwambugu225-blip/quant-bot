import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCheckboxIndeterminateIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, fill: '#FF444F', rx: 2 }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M3 8a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyCheckboxIndeterminateIcon);
export default ForwardRef;
