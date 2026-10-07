import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMobileNotchBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 8.375V9a.64.64 0 0 1-.625.625h-3.75A.617.617 0 0 1 13.5 9v-.625h-1.25c-.703 0-1.25.586-1.25 1.25v13.75c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25V9.625c0-.664-.586-1.25-1.25-1.25zm-9.375 1.25A3.11 3.11 0 0 1 12.25 6.5h7.5a3.134 3.134 0 0 1 3.125 3.125v13.75A3.11 3.11 0 0 1 19.75 26.5h-7.5c-1.758 0-3.125-1.367-3.125-3.125z' })));
const ForwardRef = forwardRef(StandaloneMobileNotchBoldIcon);
export default ForwardRef;
