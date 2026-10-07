import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowLeftRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5m18.75 0c0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633m-11.094-4.18a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-2.696 2.656h7.266c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-7.266l2.696 2.695a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0l-3.75-3.75a.66.66 0 0 1 0-.899z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowLeftRegularIcon);
export default ForwardRef;
