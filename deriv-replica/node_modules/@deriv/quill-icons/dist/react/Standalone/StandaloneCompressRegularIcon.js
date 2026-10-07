import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCompressRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.5 8.375v5a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h4.375V8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625M7.875 19h5c.313 0 .625.313.625.625v5a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V20.25H7.875a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625M19.75 8.375v4.375h4.375c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5a.617.617 0 0 1-.625-.625v-5c0-.312.273-.625.625-.625.313 0 .625.313.625.625M19.125 19h5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H19.75v4.375a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-5c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneCompressRegularIcon);
export default ForwardRef;
