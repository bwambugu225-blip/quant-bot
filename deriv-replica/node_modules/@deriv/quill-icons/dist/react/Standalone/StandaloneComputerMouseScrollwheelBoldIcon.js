import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneComputerMouseScrollwheelBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.625 20.25v-7.5c0-2.383-1.992-4.375-4.375-4.375h-2.5c-2.422 0-4.375 1.992-4.375 4.375v7.5a4.37 4.37 0 0 0 4.375 4.375h2.5c2.383 0 4.375-1.953 4.375-4.375M8.5 12.75a6.243 6.243 0 0 1 6.25-6.25h2.5c3.438 0 6.25 2.813 6.25 6.25v7.5a6.243 6.243 0 0 1-6.25 6.25h-2.5a6.22 6.22 0 0 1-6.25-6.25zm7.5-2.5c.664 0 1.25.586 1.25 1.25v1.25c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V11.5c0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneComputerMouseScrollwheelBoldIcon);
export default ForwardRef;
