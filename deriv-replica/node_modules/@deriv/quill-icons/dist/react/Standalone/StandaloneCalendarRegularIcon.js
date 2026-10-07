import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCalendarRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.625 6.5c.313 0 .625.313.625.625V9h7.5V7.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625V9h1.25c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5V11.5c0-1.367 1.094-2.5 2.5-2.5H11V7.125c0-.312.273-.625.625-.625M23.5 14h-15v10c0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25zm-1.25-3.75H9.75c-.703 0-1.25.586-1.25 1.25v1.25h15V11.5c0-.664-.586-1.25-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneCalendarRegularIcon);
export default ForwardRef;
