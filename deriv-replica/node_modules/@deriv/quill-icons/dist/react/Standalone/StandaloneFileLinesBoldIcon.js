import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileLinesBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 24.625h10a.64.64 0 0 0 .625-.625V12.75H18.5c-.703 0-1.25-.547-1.25-1.25V8.375H11a.64.64 0 0 0-.625.625v15c0 .352.273.625.625.625M11 6.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m2.188 10h5.624a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-5.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938m0 3.75h5.624a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-5.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938' })));
const ForwardRef = forwardRef(StandaloneFileLinesBoldIcon);
export default ForwardRef;
