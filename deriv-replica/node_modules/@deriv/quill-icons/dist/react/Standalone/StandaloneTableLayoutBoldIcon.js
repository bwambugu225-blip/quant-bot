import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTableLayoutBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 9.625h-15a.64.64 0 0 0-.625.625v2.5h16.25v-2.5c0-.312-.312-.625-.625-.625M7.875 22.75c0 .352.273.625.625.625h3.125v-8.75h-3.75zm5.625.625h10a.64.64 0 0 0 .625-.625v-8.125H13.5zM8.5 7.75h15c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneTableLayoutBoldIcon);
export default ForwardRef;
