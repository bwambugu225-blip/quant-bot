import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.875 16.5a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07 0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031M26 16.5c0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633m-11.29-4.102v.04a.856.856 0 0 1 1.29 0c.39.351.39.937 0 1.289l-1.836 1.835h5.899A.95.95 0 0 1 21 16.5c0 .547-.43.938-.937.938h-5.899L16 19.273c.39.391.39.977 0 1.329a.856.856 0 0 1-1.29 0l-3.437-3.438c-.39-.352-.39-.937 0-1.328z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowLeftBoldIcon);
export default ForwardRef;
