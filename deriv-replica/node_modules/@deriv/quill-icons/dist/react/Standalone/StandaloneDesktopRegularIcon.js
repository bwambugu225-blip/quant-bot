import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneDesktopRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 7.75H7.25C6.547 7.75 6 8.336 6 9v7.5h20V9c0-.664-.586-1.25-1.25-1.25m2.5 8.75v3.75c0 1.406-1.133 2.5-2.5 2.5h-5.86l.43 2.5h2.305c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-11.25a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h2.266l.43-2.5H7.25a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5zM6 17.75v2.5c0 .703.547 1.25 1.25 1.25h17.5c.664 0 1.25-.547 1.25-1.25v-2.5zm7.89 7.5h4.18l-.43-2.5h-3.32z' })));
const ForwardRef = forwardRef(StandaloneDesktopRegularIcon);
export default ForwardRef;
