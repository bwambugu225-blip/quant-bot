import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileCheckBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 24.625h10a.64.64 0 0 0 .625-.625V12.75H18.5c-.703 0-1.25-.547-1.25-1.25V8.375H11a.64.64 0 0 0-.625.625v15c0 .352.273.625.625.625M11 6.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m8.79 10.469-4.18 4.18a.97.97 0 0 1-1.329 0l-2.07-2.11c-.39-.352-.39-.937 0-1.328.351-.352.937-.352 1.328 0l1.406 1.445 3.516-3.515c.352-.352.937-.352 1.328 0a.97.97 0 0 1 0 1.328' })));
const ForwardRef = forwardRef(StandaloneFileCheckBoldIcon);
export default ForwardRef;
