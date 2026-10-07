import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSquareMinusRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 9c-.703 0-1.25.586-1.25 1.25v12.5c0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25v-12.5c0-.664-.586-1.25-1.25-1.25zm-2.5 1.25c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm5 5.625h7.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-7.5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneSquareMinusRegularIcon);
export default ForwardRef;
