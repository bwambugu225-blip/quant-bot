import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMemoPadRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 11.5V24c0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25V11.5zm0-1.25h15V9c0-.664-.586-1.25-1.25-1.25H9.75c-.703 0-1.25.586-1.25 1.25zM24.75 9v15c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5m-13.125 5h8.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-8.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m0 3.75h8.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-8.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m0 3.75h5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneMemoPadRegularIcon);
export default ForwardRef;
