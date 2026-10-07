import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWindowMaximizeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 7.75h15c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5m1.25 2.5c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneWindowMaximizeFillIcon);
export default ForwardRef;
