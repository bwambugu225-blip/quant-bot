import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpFromSquareRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.43 6.695 4.062 4.063a.66.66 0 0 1 0 .898.66.66 0 0 1-.898 0l-2.969-3.008V19a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.648l-3.008 3.008a.66.66 0 0 1-.898 0 .66.66 0 0 1 0-.898l4.062-4.063a.66.66 0 0 1 .899 0M8.5 7.75h1.25c.313 0 .625.313.625.625A.64.64 0 0 1 9.75 9H8.5c-.703 0-1.25.586-1.25 1.25V24c0 .703.547 1.25 1.25 1.25h15c.664 0 1.25-.547 1.25-1.25V10.25c0-.664-.586-1.25-1.25-1.25h-1.25a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h1.25c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5h-15A2.47 2.47 0 0 1 6 24V10.25c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneArrowUpFromSquareRegularIcon);
export default ForwardRef;
