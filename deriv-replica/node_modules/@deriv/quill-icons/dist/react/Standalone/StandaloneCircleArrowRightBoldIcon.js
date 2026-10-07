import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m11.29 4.102c-.392.39-.977.39-1.33 0-.39-.352-.39-.938 0-1.329l1.837-1.835h-5.86c-.546 0-.937-.391-.937-.938 0-.508.39-.937.938-.937h5.859l-1.836-1.836a.856.856 0 0 1 0-1.29c.351-.39.937-.39 1.328 0l3.438 3.438a.92.92 0 0 1 0 1.29z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowRightBoldIcon);
export default ForwardRef;
