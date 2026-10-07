import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyClose2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M2.293 3.707a1 1 0 0 1 1.414-1.414L8 6.586l4.293-4.293a1 1 0 1 1 1.414 1.414L9.414 8l4.293 4.293a1 1 0 0 1-1.414 1.414L8 9.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L6.586 8z' })));
const ForwardRef = forwardRef(LegacyClose2pxIcon);
export default ForwardRef;
