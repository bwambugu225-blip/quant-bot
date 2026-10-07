import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRotateRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm21.078 12.75-.664-.664a6.32 6.32 0 0 0-8.867 0 6.32 6.32 0 0 0 0 8.867 6.32 6.32 0 0 0 8.867 0c.469-.508 1.25-.508 1.758 0 .469.469.469 1.25 0 1.758a8.794 8.794 0 0 1-12.383 0 8.794 8.794 0 0 1 0-12.383 8.794 8.794 0 0 1 12.383 0l.703.703V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v5c0 .703-.586 1.25-1.25 1.25h-5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneArrowRotateRightFillIcon);
export default ForwardRef;
