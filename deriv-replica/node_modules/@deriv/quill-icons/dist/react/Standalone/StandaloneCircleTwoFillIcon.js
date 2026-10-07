import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleTwoFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-1.328-12.773c.312-.196.625-.313 1.015-.313h.118c.78 0 1.445.664 1.445 1.445 0 .391-.195.782-.469 1.055l-4.258 3.984a.98.98 0 0 0-.234 1.016.99.99 0 0 0 .899.586h5.624c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938H15.53l2.54-2.344c.663-.625 1.015-1.484 1.015-2.422a3.327 3.327 0 0 0-3.242-3.32h-.156a3.54 3.54 0 0 0-2.149.703l-.937.703c-.43.313-.508.938-.196 1.328.313.43.938.508 1.328.196z' })));
const ForwardRef = forwardRef(StandaloneCircleTwoFillIcon);
export default ForwardRef;
