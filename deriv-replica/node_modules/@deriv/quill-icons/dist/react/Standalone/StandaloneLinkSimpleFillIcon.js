import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLinkSimpleFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 16.5A6.243 6.243 0 0 1 11 10.25h2.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11a3.751 3.751 0 0 0 0 7.5h2.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11a6.22 6.22 0 0 1-6.25-6.25m22.5 0A6.243 6.243 0 0 1 21 22.75h-2.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25H21a3.751 3.751 0 0 0 0-7.5h-2.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25H21c3.438 0 6.25 2.813 6.25 6.25m-15-1.25h7.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-7.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneLinkSimpleFillIcon);
export default ForwardRef;
