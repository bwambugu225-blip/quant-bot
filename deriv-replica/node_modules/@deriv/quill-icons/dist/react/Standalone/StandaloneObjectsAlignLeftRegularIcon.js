import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneObjectsAlignLeftRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 7.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625v18.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm6.25 6.25c0 .352.273.625.625.625h11.25a.64.64 0 0 0 .625-.625v-2.5c0-.312-.312-.625-.625-.625h-11.25a.64.64 0 0 0-.625.625zm-1.25-2.5C11 9.859 11.82 9 12.875 9h11.25C25.141 9 26 9.86 26 10.875v2.5c0 1.055-.86 1.875-1.875 1.875h-11.25A1.85 1.85 0 0 1 11 13.375zm1.25 11.25c0 .352.273.625.625.625h6.25a.64.64 0 0 0 .625-.625v-2.5c0-.312-.312-.625-.625-.625h-6.25a.64.64 0 0 0-.625.625zm-1.25-2.5c0-1.016.82-1.875 1.875-1.875h6.25c1.016 0 1.875.86 1.875 1.875v2.5C21 23.18 20.14 24 19.125 24h-6.25A1.85 1.85 0 0 1 11 22.125z' })));
const ForwardRef = forwardRef(StandaloneObjectsAlignLeftRegularIcon);
export default ForwardRef;
