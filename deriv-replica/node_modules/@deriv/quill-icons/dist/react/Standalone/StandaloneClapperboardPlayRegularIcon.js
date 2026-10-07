import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneClapperboardPlayRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 14H7.25v8.75c0 .703.547 1.25 1.25 1.25h15c.664 0 1.25-.547 1.25-1.25zm0-1.25v-2.5c0-.352-.156-.664-.43-.898l-3.398 3.398zm-9.766 0h4.18L22.914 9h-4.18zm-1.757 0L16.977 9h-4.18l-3.75 3.75zM8.5 9c-.703 0-1.25.586-1.25 1.25v2.5h.04L11.04 9zM26 12.75v10c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5h15c1.367 0 2.5 1.133 2.5 2.5zm-11.562 2.617 5.312 3.125a.61.61 0 0 1 .313.508c0 .234-.118.43-.313.547l-5.312 3.125a.6.6 0 0 1-.626 0c-.195-.117-.351-.313-.351-.547v-6.25c0-.195.156-.43.351-.508a.6.6 0 0 1 .626 0M18.188 19l-3.438-2.031v4.062z' })));
const ForwardRef = forwardRef(StandaloneClapperboardPlayRegularIcon);
export default ForwardRef;
