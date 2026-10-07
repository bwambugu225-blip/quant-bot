import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleChevronUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m4.727-9.414-4.102-4.063a.92.92 0 0 0-1.29 0l-4.062 4.063c-.39.39-.39.977 0 1.328.352.39.938.39 1.329 0L16 15.016l3.398 3.398c.352.39.938.39 1.329 0 .351-.352.351-.937 0-1.328' })));
const ForwardRef = forwardRef(StandaloneCircleChevronUpFillIcon);
export default ForwardRef;
