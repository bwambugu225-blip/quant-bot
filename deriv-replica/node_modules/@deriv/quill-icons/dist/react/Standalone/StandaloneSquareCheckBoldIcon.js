import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSquareCheckBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 9.625a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625v-12.5c0-.312-.312-.625-.625-.625zm-2.5.625c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm13.164 4.414-5 5c-.39.39-.976.39-1.328 0l-2.5-2.5a.856.856 0 0 1 0-1.289c.351-.39.937-.39 1.328 0l1.836 1.836 4.336-4.375a.92.92 0 0 1 1.289 0c.39.39.39.976 0 1.328z' })));
const ForwardRef = forwardRef(StandaloneSquareCheckBoldIcon);
export default ForwardRef;
