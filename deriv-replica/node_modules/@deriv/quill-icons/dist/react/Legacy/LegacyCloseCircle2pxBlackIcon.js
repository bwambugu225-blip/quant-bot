import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCloseCircle2pxBlackIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, fill: '#333', rx: 8 }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M5.293 5.293a1 1 0 0 1 1.414 0L8 6.586l1.293-1.293a1 1 0 0 1 1.414 1.414L9.414 8l1.293 1.293a1 1 0 0 1-1.414 1.414L8 9.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L6.586 8 5.293 6.707a1 1 0 0 1 0-1.414', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyCloseCircle2pxBlackIcon);
export default ForwardRef;
