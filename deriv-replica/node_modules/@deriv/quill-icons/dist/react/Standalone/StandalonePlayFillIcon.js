import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePlayFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm11.352 8.023 11.25 6.875c.546.352.898.977.898 1.602 0 .664-.352 1.29-.898 1.602l-11.25 6.875c-.586.351-1.329.39-1.915.039-.585-.313-.937-.938-.937-1.641V9.625c0-.664.352-1.29.938-1.602a1.87 1.87 0 0 1 1.914 0' })));
const ForwardRef = forwardRef(StandalonePlayFillIcon);
export default ForwardRef;
