import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMobileScreenButtonRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.75 7.75h-7.5C11.547 7.75 11 8.336 11 9v10h10V9c0-.664-.586-1.25-1.25-1.25M21 20.25H11V24c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25zM12.25 6.5h7.5c1.367 0 2.5 1.133 2.5 2.5v15c0 1.406-1.133 2.5-2.5 2.5h-7.5a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5m1.875 16.25c0-.312.273-.625.625-.625h2.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-2.5a.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneMobileScreenButtonRegularIcon);
export default ForwardRef;
