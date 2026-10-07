import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleEuroRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m5 .625h.938c-.04-.195-.04-.39-.04-.586s0-.43.04-.664H11a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h1.328c.703-1.445 2.227-2.5 3.945-2.5h1.641c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-1.64c-1.016 0-1.915.508-2.5 1.25h3.476c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-4.062c-.04.234-.04.43-.04.664 0 .195 0 .43.04.586h4.062c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-3.516c.586.82 1.485 1.328 2.54 1.328h1.64c.313 0 .625.274.625.625a.64.64 0 0 1-.625.625h-1.64c-1.758 0-3.282-1.055-3.985-2.578H11a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneCircleEuroRegularIcon);
export default ForwardRef;
