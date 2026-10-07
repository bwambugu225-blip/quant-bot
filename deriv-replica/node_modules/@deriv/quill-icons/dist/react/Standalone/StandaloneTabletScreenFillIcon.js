import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTabletScreenFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v15c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm6.25 15c0 .352.273.625.625.625h3.75A.64.64 0 0 0 18.5 24c0-.312-.312-.625-.625-.625h-3.75A.64.64 0 0 0 13.5 24m8.75-15H9.75v12.5h12.5z' })));
const ForwardRef = forwardRef(StandaloneTabletScreenFillIcon);
export default ForwardRef;
