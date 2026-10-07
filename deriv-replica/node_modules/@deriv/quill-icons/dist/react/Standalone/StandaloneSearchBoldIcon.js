import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSearchBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M20.375 14.625c0-2.227-1.21-4.258-3.125-5.39-1.953-1.133-4.336-1.133-6.25 0-1.953 1.132-3.125 3.163-3.125 5.39A6.22 6.22 0 0 0 11 20.055c1.914 1.133 4.297 1.133 6.25 0 1.914-1.133 3.125-3.164 3.125-5.43m-1.21 6.406a8.2 8.2 0 0 1-5.04 1.719A8.12 8.12 0 0 1 6 14.625C6 10.172 9.633 6.5 14.125 6.5c4.453 0 8.125 3.672 8.125 8.125a8.25 8.25 0 0 1-1.758 5.078l5.235 5.195c.351.391.351.977 0 1.329-.391.39-.977.39-1.329 0z' })));
const ForwardRef = forwardRef(StandaloneSearchBoldIcon);
export default ForwardRef;
