import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCloneBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 24.625h8.75a.64.64 0 0 0 .625-.625v-2.5h1.875V24c0 1.406-1.133 2.5-2.5 2.5H8.5A2.47 2.47 0 0 1 6 24v-8.75c0-1.367 1.094-2.5 2.5-2.5H11v1.875H8.5a.64.64 0 0 0-.625.625V24c0 .352.273.625.625.625m6.25-6.25h8.75a.64.64 0 0 0 .625-.625V9c0-.312-.312-.625-.625-.625h-8.75a.64.64 0 0 0-.625.625v8.75c0 .352.273.625.625.625m-2.5-.625V9c0-1.367 1.094-2.5 2.5-2.5h8.75C24.867 6.5 26 7.633 26 9v8.75c0 1.406-1.133 2.5-2.5 2.5h-8.75a2.47 2.47 0 0 1-2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneCloneBoldIcon);
export default ForwardRef;
