import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMobileNotchRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 7.75v.625c0 .703-.586 1.25-1.25 1.25h-2.5c-.703 0-1.25-.547-1.25-1.25V7.75h-1.25C11.547 7.75 11 8.336 11 9v15c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25V9c0-.664-.586-1.25-1.25-1.25zm-1.25 0h-2.5v.625h2.5zM9.75 9c0-1.367 1.094-2.5 2.5-2.5h7.5c1.367 0 2.5 1.133 2.5 2.5v15c0 1.406-1.133 2.5-2.5 2.5h-7.5a2.47 2.47 0 0 1-2.5-2.5z' })));
const ForwardRef = forwardRef(StandaloneMobileNotchRegularIcon);
export default ForwardRef;
