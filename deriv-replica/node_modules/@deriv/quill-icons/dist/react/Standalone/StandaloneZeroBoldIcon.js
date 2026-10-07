import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneZeroBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 14A6.243 6.243 0 0 1 16 7.75c3.438 0 6.25 2.813 6.25 6.25v5A6.243 6.243 0 0 1 16 25.25 6.22 6.22 0 0 1 9.75 19zM16 9.625c-2.422 0-4.375 1.992-4.375 4.375v5A4.37 4.37 0 0 0 16 23.375c2.383 0 4.375-1.953 4.375-4.375v-5c0-2.383-1.992-4.375-4.375-4.375' })));
const ForwardRef = forwardRef(StandaloneZeroBoldIcon);
export default ForwardRef;
