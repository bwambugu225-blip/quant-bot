import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownAZRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.18 21.344-3.75 3.75a.66.66 0 0 1-.899 0l-3.75-3.75a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l2.695 2.696V8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625v14.766l2.656-2.696a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899m6.367-13.242 2.5 5v.039l.625 1.21a.64.64 0 0 1-.274.86c-.312.156-.703 0-.859-.274L23.11 14h-4.257l-.43.938a.64.64 0 0 1-.86.273.64.64 0 0 1-.273-.86l.625-1.21v-.04l2.5-5c.117-.195.313-.351.586-.351.234 0 .43.156.547.352M21 9.782l-1.523 2.968h3.007zm-2.5 7.968h5c.234 0 .43.156.547.39a.53.53 0 0 1-.078.626L19.789 24H23.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5q-.41 0-.586-.352c-.078-.195-.078-.468.078-.664L22.172 19H18.5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneArrowDownAZRegularIcon);
export default ForwardRef;
