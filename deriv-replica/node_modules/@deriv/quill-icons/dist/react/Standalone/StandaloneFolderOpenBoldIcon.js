import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFolderOpenBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.75 25.25H7.25a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5h4.57c.664 0 1.29.273 1.758.742l1.055 1.055c.469.469 1.094.703 1.758.703H21c1.367 0 2.5 1.133 2.5 2.5V14h-1.875v-1.25c0-.312-.312-.625-.625-.625h-4.61c-1.171 0-2.265-.43-3.085-1.25L12.25 9.82a.63.63 0 0 0-.43-.195H7.25a.64.64 0 0 0-.625.625v10.234l2.656-4.609c.235-.39.625-.625 1.094-.625H26c.43 0 .86.234 1.055.625.234.39.234.898 0 1.29l-4.375 7.5a1.28 1.28 0 0 1-1.055.585z' })));
const ForwardRef = forwardRef(StandaloneFolderOpenBoldIcon);
export default ForwardRef;
