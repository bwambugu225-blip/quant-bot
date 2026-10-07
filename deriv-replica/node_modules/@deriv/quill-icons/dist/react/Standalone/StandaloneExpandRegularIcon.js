import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneExpandRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 7.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H8.5v4.375a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-5c0-.312.273-.625.625-.625zM7.25 19.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625V24h4.375c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625zM24.125 7.75c.313 0 .625.313.625.625v5a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V9h-4.375a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625zM23.5 19.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v5a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H23.5z' })));
const ForwardRef = forwardRef(StandaloneExpandRegularIcon);
export default ForwardRef;
