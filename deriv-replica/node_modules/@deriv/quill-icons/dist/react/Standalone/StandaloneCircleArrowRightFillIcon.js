import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10.977 5.04 4.375-4.376c.351-.352.351-.937 0-1.328L16.977 11.5c-.391-.39-.977-.39-1.329 0a.856.856 0 0 0 0 1.29l2.774 2.773h-7.11a.925.925 0 0 0-.937.937c0 .547.39.938.938.938l7.109.039-2.774 2.773a.856.856 0 0 0 0 1.29c.352.39.938.39 1.329 0' })));
const ForwardRef = forwardRef(StandaloneCircleArrowRightFillIcon);
export default ForwardRef;
