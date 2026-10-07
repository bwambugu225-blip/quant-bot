import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleQuestionRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m6.563-3.36c.273-.937 1.132-1.64 2.109-1.64h2.265c1.368 0 2.5 1.133 2.5 2.54 0 .937-.546 1.796-1.367 2.226l-1.445.742v.742a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-1.133c0-.234.117-.469.313-.547l1.796-.937c.43-.195.703-.625.703-1.094 0-.703-.585-1.289-1.25-1.289h-2.265c-.39 0-.781.313-.899.703v.04c-.078.312-.43.546-.742.429a.617.617 0 0 1-.469-.742zm2.5 7.11c0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938-.547 0-.937-.391-.937-.938' })));
const ForwardRef = forwardRef(StandaloneCircleQuestionRegularIcon);
export default ForwardRef;
