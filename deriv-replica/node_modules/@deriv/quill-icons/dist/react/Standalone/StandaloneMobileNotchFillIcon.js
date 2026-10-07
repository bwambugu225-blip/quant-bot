import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMobileNotchFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.5 9h-1.25a.64.64 0 0 0-.625.625v13.75c0 .352.273.625.625.625h7.5a.64.64 0 0 0 .625-.625V9.625c0-.312-.312-.625-.625-.625H18.5v.625a.64.64 0 0 1-.625.625h-3.75a.617.617 0 0 1-.625-.625zm-1.25-2.5h7.5a3.134 3.134 0 0 1 3.125 3.125v13.75A3.11 3.11 0 0 1 19.75 26.5h-7.5c-1.758 0-3.125-1.367-3.125-3.125V9.625A3.11 3.11 0 0 1 12.25 6.5m1.25 15.625c0-.312.273-.625.625-.625h3.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-3.75a.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneMobileNotchFillIcon);
export default ForwardRef;
