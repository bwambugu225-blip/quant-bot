import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileArrowDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.375 24c0 .352.273.625.625.625h10a.64.64 0 0 0 .625-.625V12.75H18.5c-.703 0-1.25-.547-1.25-1.25V8.375H11a.64.64 0 0 0-.625.625zM11 6.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m5.938 9.063v4.023l1.21-1.211c.352-.39.938-.39 1.329 0a.92.92 0 0 1 0 1.29l-2.813 2.812c-.39.39-.977.39-1.328 0l-2.813-2.813a.856.856 0 0 1 0-1.289c.352-.39.938-.39 1.329 0l1.21 1.21v-4.023c0-.507.391-.937.938-.937a.95.95 0 0 1 .938.938' })));
const ForwardRef = forwardRef(StandaloneFileArrowDownBoldIcon);
export default ForwardRef;
