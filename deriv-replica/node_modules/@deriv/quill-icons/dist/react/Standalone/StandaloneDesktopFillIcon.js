import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneDesktopFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 6.5h17.5c1.367 0 2.5 1.133 2.5 2.5v11.25c0 1.406-1.133 2.5-2.5 2.5h-6.875l.39 1.25H21c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h2.695l.43-1.25H7.25a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5M24.75 9H7.25v8.75h17.5z' })));
const ForwardRef = forwardRef(StandaloneDesktopFillIcon);
export default ForwardRef;
