import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.86 8.14 6.25 6.25c.507.47.507 1.29 0 1.758a1.205 1.205 0 0 1-1.758 0l-4.102-4.101V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V12.047l-4.14 4.101a1.205 1.205 0 0 1-1.758 0 1.205 1.205 0 0 1 0-1.757l6.25-6.25a1.205 1.205 0 0 1 1.757 0' })));
const ForwardRef = forwardRef(StandaloneArrowUpFillIcon);
export default ForwardRef;
