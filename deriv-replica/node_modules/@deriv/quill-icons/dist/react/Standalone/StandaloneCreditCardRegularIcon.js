import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCreditCardRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.75 9c-.703 0-1.25.586-1.25 1.25v1.25h20v-1.25c0-.664-.586-1.25-1.25-1.25zM6.5 12.75v2.5h20v-2.5zm0 3.75v6.25c0 .703.547 1.25 1.25 1.25h17.5c.664 0 1.25-.547 1.25-1.25V16.5zm-1.25-6.25c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.75a2.47 2.47 0 0 1-2.5-2.5zM9 20.875c0-.312.273-.625.625-.625h2.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-2.5A.617.617 0 0 1 9 20.875m5 0c0-.312.273-.625.625-.625h5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneCreditCardRegularIcon);
export default ForwardRef;
