import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleChevronLeftFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26 16.5c0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633m-9.414-4.727-4.063 4.102a.856.856 0 0 0 0 1.29l4.063 4.062c.352.39.937.39 1.289 0 .39-.352.39-.938 0-1.329L14.477 16.5l3.398-3.398c.39-.352.39-.938 0-1.329a.92.92 0 0 0-1.29 0' })));
const ForwardRef = forwardRef(StandaloneCircleChevronLeftFillIcon);
export default ForwardRef;
