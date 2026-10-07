import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSignalRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26.625 7.125v18.75A.64.64 0 0 1 26 26.5a.617.617 0 0 1-.625-.625V7.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625M21 10.25c.313 0 .625.313.625.625v15A.64.64 0 0 1 21 26.5a.617.617 0 0 1-.625-.625v-15c0-.312.273-.625.625-.625m-4.375 4.375v11.25A.64.64 0 0 1 16 26.5a.617.617 0 0 1-.625-.625v-11.25c0-.312.273-.625.625-.625.313 0 .625.313.625.625M11 17.75c.313 0 .625.313.625.625v7.5A.64.64 0 0 1 11 26.5a.617.617 0 0 1-.625-.625v-7.5c0-.312.273-.625.625-.625M6 21.5c.313 0 .625.313.625.625v3.75A.64.64 0 0 1 6 26.5a.617.617 0 0 1-.625-.625v-3.75c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneSignalRegularIcon);
export default ForwardRef;
