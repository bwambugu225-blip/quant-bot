import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMemoPadFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v1.25H7.25zm0 2.5h17.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zM11 15.25c0 .352.273.625.625.625h8.75A.64.64 0 0 0 21 15.25c0-.312-.312-.625-.625-.625h-8.75a.64.64 0 0 0-.625.625M11 19c0 .352.273.625.625.625h8.75A.64.64 0 0 0 21 19c0-.312-.312-.625-.625-.625h-8.75A.64.64 0 0 0 11 19m0 3.75c0 .352.273.625.625.625h3.75A.64.64 0 0 0 16 22.75c0-.312-.312-.625-.625-.625h-3.75a.64.64 0 0 0-.625.625' })));
const ForwardRef = forwardRef(StandaloneMemoPadFillIcon);
export default ForwardRef;
