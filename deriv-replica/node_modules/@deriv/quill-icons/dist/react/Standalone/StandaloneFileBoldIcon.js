import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.5 24.625a.64.64 0 0 0 .625-.625V12.75H19c-.703 0-1.25-.547-1.25-1.25V8.375H11.5a.64.64 0 0 0-.625.625v15c0 .352.273.625.625.625zM9 9c0-1.367 1.094-2.5 2.5-2.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 9 24z' })));
const ForwardRef = forwardRef(StandaloneFileBoldIcon);
export default ForwardRef;
