import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLaptopMobileBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 8.375A.64.64 0 0 0 7.875 9v10h9.375v2.5H5.375A1.85 1.85 0 0 1 3.5 19.625c0-.312.273-.625.625-.625H6V9c0-1.367 1.094-2.5 2.5-2.5H21c1.367 0 2.5 1.133 2.5 2.5v1.25h-1.875V9c0-.312-.312-.625-.625-.625zm10 5c0-1.016.82-1.875 1.875-1.875h6.25c1.016 0 1.875.86 1.875 1.875v11.25c0 1.055-.86 1.875-1.875 1.875h-6.25a1.85 1.85 0 0 1-1.875-1.875zm1.875 0v11.25h6.25v-11.25z' })));
const ForwardRef = forwardRef(StandaloneLaptopMobileBoldIcon);
export default ForwardRef;
