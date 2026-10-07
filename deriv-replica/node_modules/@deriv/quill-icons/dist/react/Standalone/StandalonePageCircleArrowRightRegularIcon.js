import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePageCircleArrowRightRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 9c0-1.367 1.094-2.5 2.5-2.5h7.07c.664 0 1.29.273 1.758.742l2.93 2.93c.469.469.742 1.094.742 1.758v2.343c-.469.118-.86.274-1.25.508V11.93c0-.352-.156-.664-.39-.899l-2.891-2.89a1.27 1.27 0 0 0-.899-.391H7.25C6.547 7.75 6 8.336 6 9v15c0 .703.547 1.25 1.25 1.25h9.063c.39.469.82.898 1.289 1.25H7.25a2.47 2.47 0 0 1-2.5-2.5zM16 20.875c0-3.086 2.5-5.625 5.625-5.625 3.086 0 5.625 2.54 5.625 5.625a5.626 5.626 0 0 1-5.625 5.625A5.6 5.6 0 0 1 16 20.875m1.25 0a4.37 4.37 0 0 0 4.375 4.375c2.383 0 4.375-1.953 4.375-4.375 0-2.383-1.992-4.375-4.375-4.375-2.422 0-4.375 1.992-4.375 4.375m1.25 0c0-.312.273-.625.625-.625h3.477l-1.133-1.094a.66.66 0 0 1 0-.898.66.66 0 0 1 .898 0l2.188 2.187a.66.66 0 0 1 0 .899l-2.188 2.187a.66.66 0 0 1-.898 0 .66.66 0 0 1 0-.898l1.133-1.133h-3.477a.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandalonePageCircleArrowRightRegularIcon);
export default ForwardRef;
