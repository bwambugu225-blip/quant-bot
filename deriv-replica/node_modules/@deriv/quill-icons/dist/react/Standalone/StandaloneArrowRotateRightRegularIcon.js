import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRotateRightRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 14h-5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h3.36A7.5 7.5 0 0 0 16 9c-4.14 0-7.5 3.36-7.5 7.5S11.86 24 16 24a7.55 7.55 0 0 0 6.29-3.398c.116-.196.35-.352.585-.352.469 0 .781.508.508.938-1.524 2.46-4.297 4.062-7.383 4.062a8.736 8.736 0 0 1-8.75-8.75c0-4.805 3.906-8.75 8.75-8.75 3.164 0 5.938 1.719 7.5 4.258V8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625v5a.64.64 0 0 1-.625.625' })));
const ForwardRef = forwardRef(StandaloneArrowRotateRightRegularIcon);
export default ForwardRef;
