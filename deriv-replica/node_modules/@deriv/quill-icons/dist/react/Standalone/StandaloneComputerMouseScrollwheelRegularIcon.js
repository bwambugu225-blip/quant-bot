import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneComputerMouseScrollwheelRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 20.25v-7.5c0-2.734-2.266-5-5-5h-2.5c-2.773 0-5 2.266-5 5v7.5c0 2.773 2.227 5 5 5h2.5c2.734 0 5-2.227 5-5M8.5 12.75a6.243 6.243 0 0 1 6.25-6.25h2.5c3.438 0 6.25 2.813 6.25 6.25v7.5a6.243 6.243 0 0 1-6.25 6.25h-2.5a6.22 6.22 0 0 1-6.25-6.25zm8.125-1.875v2.5A.64.64 0 0 1 16 14a.617.617 0 0 1-.625-.625v-2.5c0-.312.273-.625.625-.625.313 0 .625.313.625.625' })));
const ForwardRef = forwardRef(StandaloneComputerMouseScrollwheelRegularIcon);
export default ForwardRef;
