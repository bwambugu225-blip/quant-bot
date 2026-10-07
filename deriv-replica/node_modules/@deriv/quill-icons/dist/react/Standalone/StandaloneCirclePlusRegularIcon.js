import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCirclePlusRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 7.75a8.73 8.73 0 0 0-7.578 4.375c-1.602 2.734-1.602 6.055 0 8.75C9.984 23.609 12.836 25.25 16 25.25a8.63 8.63 0 0 0 7.54-4.375c1.6-2.695 1.6-6.016 0-8.75C21.976 9.43 19.124 7.75 16 7.75m0 18.75c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-.625-6.25v-3.125H12.25a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h3.125V12.75c0-.312.273-.625.625-.625.313 0 .625.313.625.625v3.125h3.125c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-3.125v3.125a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneCirclePlusRegularIcon);
export default ForwardRef;
