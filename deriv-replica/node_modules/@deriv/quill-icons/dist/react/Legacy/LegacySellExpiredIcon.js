import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacySellExpiredIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M2.5 1a.5.5 0 0 1 .5.5V2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3v4.5a.5.5 0 0 1-1 0v-13a.5.5 0 0 1 .5-.5M11 7H9v2h2zM7 7H5v2h2zm6-2h-2v2h2zM9 5H7v2h2zM5 5H3v2h2zm6-2H9v2h2zM7 3H5v2h2z' })));
const ForwardRef = forwardRef(LegacySellExpiredIcon);
export default ForwardRef;
