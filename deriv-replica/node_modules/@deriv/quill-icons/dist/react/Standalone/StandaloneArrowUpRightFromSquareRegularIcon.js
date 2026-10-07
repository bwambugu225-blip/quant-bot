import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpRightFromSquareRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.125 6.5h6.25c.313 0 .625.313.625.625v6.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.648l-9.57 9.57a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.898l9.57-9.57h-4.726a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625M8.5 7.75h5.625c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H8.5c-.703 0-1.25.586-1.25 1.25V24c0 .703.547 1.25 1.25 1.25h13.75c.664 0 1.25-.547 1.25-1.25v-5.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625V24c0 1.406-1.133 2.5-2.5 2.5H8.5A2.47 2.47 0 0 1 6 24V10.25c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneArrowUpRightFromSquareRegularIcon);
export default ForwardRef;
