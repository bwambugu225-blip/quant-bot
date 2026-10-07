import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCaretUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m0-14.375c-.273 0-.547.117-.703.313l-4.063 4.374c-.273.274-.312.665-.156 1.016.117.352.469.547.86.547h8.124a.94.94 0 0 0 .86-.547c.117-.351.078-.742-.195-1.015l-4.063-4.375a.9.9 0 0 0-.664-.313' })));
const ForwardRef = forwardRef(StandaloneCircleCaretUpFillIcon);
export default ForwardRef;
