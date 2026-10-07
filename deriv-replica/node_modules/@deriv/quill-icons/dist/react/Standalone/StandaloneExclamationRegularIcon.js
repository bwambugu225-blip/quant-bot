import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneExclamationRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.625 8.375V20.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625M16 24.938c-.547 0-.937-.391-.937-.938 0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938' })));
const ForwardRef = forwardRef(StandaloneExclamationRegularIcon);
export default ForwardRef;
