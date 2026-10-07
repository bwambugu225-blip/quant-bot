import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleTrashRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m6.25-4.375h1.602l.43-.43a.65.65 0 0 1 .468-.195h2.5c.156 0 .313.078.43.195l.43.43h1.64c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-.117l-.43 6.992c-.078.625-.625 1.133-1.25 1.133h-3.945a1.23 1.23 0 0 1-1.211-1.133l-.469-6.992h-.078a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m6.133 1.25h-4.805l.43 6.875h3.945z' })));
const ForwardRef = forwardRef(StandaloneCircleTrashRegularIcon);
export default ForwardRef;
