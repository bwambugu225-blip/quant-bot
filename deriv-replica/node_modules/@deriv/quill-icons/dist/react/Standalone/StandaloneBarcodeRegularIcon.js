import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBarcodeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm2.5 0c0-.312.273-.625.625-.625.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm3.125-.625c.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.375c0-.312.273-.625.625-.625m3.125.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm3.125-.625c.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.375c0-.312.273-.625.625-.625M21 8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm4.375-.625c.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.375c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneBarcodeRegularIcon);
export default ForwardRef;
