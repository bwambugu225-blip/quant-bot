import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleEightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10.313-5c1.523 0 2.812 1.29 2.812 2.813 0 .624-.195 1.21-.547 1.64.703.586 1.172 1.445 1.172 2.422a3.11 3.11 0 0 1-3.125 3.125h-1.25c-1.758 0-3.125-1.367-3.125-3.125 0-.977.43-1.836 1.133-2.422-.313-.43-.508-1.015-.508-1.64a2.826 2.826 0 0 1 2.813-2.813zm-.625 3.75h.624c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938h-.625a.925.925 0 0 0-.938.938c0 .546.39.937.938.937m.624 1.875h-.937c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25h1.25c.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneCircleEightBoldIcon);
export default ForwardRef;
