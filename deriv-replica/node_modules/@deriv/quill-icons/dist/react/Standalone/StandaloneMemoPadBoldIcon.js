import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMemoPadBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.875 11.5H9.125V24c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625zM9.75 6.5h12.5c1.367 0 2.5 1.133 2.5 2.5v15c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5M11 14.313c0-.508.39-.938.938-.938h8.124a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-8.125c-.547 0-.938-.39-.938-.937m0 3.75c0-.508.39-.938.938-.938h8.124a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-8.125c-.547 0-.938-.39-.938-.937m0 3.75c0-.508.39-.938.938-.938h4.374a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-4.375c-.547 0-.938-.39-.938-.937' })));
const ForwardRef = forwardRef(StandaloneMemoPadBoldIcon);
export default ForwardRef;
