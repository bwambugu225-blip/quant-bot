import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleQuestionBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m6.602-3.516a2.18 2.18 0 0 1 2.07-1.484h2.265c1.368 0 2.5 1.133 2.5 2.5 0 .86-.507 1.68-1.25 2.11l-1.25.742c-.039.507-.43.898-.937.898-.547 0-.937-.39-.937-.937v-.508c0-.352.156-.664.468-.82l1.719-.977a.61.61 0 0 0 .313-.508c0-.352-.274-.586-.625-.586h-2.266a.29.29 0 0 0-.274.195l-.039.04c-.156.507-.703.742-1.171.585a.976.976 0 0 1-.586-1.21zm2.148 7.266c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneCircleQuestionBoldIcon);
export default ForwardRef;
