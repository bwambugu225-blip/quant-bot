import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowUpRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 24.625c2.89 0 5.547-1.523 7.031-4.062 1.446-2.5 1.446-5.586 0-8.125-1.484-2.5-4.14-4.063-7.031-4.063-2.93 0-5.586 1.563-7.07 4.063-1.446 2.539-1.446 5.624 0 8.124A8.13 8.13 0 0 0 16 24.626M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m-2.5 5.625h5.938a.95.95 0 0 1 .937.938v6.25c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-3.985l-5.273 5.274c-.391.39-.977.39-1.329 0a.856.856 0 0 1 0-1.29l5.274-5.273H13.5a.925.925 0 0 1-.937-.937c0-.547.39-.938.937-.938z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowUpRightBoldIcon);
export default ForwardRef;
