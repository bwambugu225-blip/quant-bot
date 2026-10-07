import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLocationDotBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.625 14c0-3.086-2.54-5.625-5.625-5.625A5.626 5.626 0 0 0 10.375 14c0 .508.156 1.25.586 2.266.39.937.976 2.03 1.64 3.125 1.133 1.797 2.422 3.515 3.399 4.765.938-1.25 2.227-2.968 3.36-4.765.663-1.094 1.25-2.188 1.64-3.125.43-1.016.625-1.758.625-2.266m1.875 0c0 3.438-4.57 9.492-6.602 12.031a1.178 1.178 0 0 1-1.835 0C13.07 23.492 8.5 17.438 8.5 14c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5m-6.25 0c0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25m-4.375 0c0-1.094.586-2.11 1.563-2.695.937-.547 2.148-.547 3.124 0 .938.586 1.563 1.601 1.563 2.695 0 1.133-.625 2.148-1.562 2.734-.977.547-2.188.547-3.125 0A3.16 3.16 0 0 1 12.875 14' })));
const ForwardRef = forwardRef(StandaloneLocationDotBoldIcon);
export default ForwardRef;
