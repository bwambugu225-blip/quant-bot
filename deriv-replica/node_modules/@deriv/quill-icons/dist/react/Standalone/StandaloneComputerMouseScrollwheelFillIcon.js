import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneComputerMouseScrollwheelFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.75 6.5h2.5c3.438 0 6.25 2.813 6.25 6.25v7.5a6.243 6.243 0 0 1-6.25 6.25h-2.5a6.22 6.22 0 0 1-6.25-6.25v-7.5a6.243 6.243 0 0 1 6.25-6.25m2.5 5c0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25v1.25c0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneComputerMouseScrollwheelFillIcon);
export default ForwardRef;
