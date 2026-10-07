import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleChevronRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m9.414 4.727 4.063-4.063c.351-.352.351-.937 0-1.328l-4.063-4.024c-.39-.39-.976-.39-1.328 0-.39.352-.39.938 0 1.329l3.398 3.398-3.398 3.398a.856.856 0 0 0 0 1.29c.351.39.937.39 1.328 0' })));
const ForwardRef = forwardRef(StandaloneCircleChevronRightFillIcon);
export default ForwardRef;
