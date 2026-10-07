import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowDownRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 24.625c2.89 0 5.547-1.523 7.031-4.062 1.446-2.5 1.446-5.586 0-8.125-1.484-2.5-4.14-4.063-7.031-4.063-2.93 0-5.586 1.563-7.07 4.063-1.446 2.539-1.446 5.624 0 8.124A8.13 8.13 0 0 0 16 24.626M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m-2.5 14.375c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938h3.672l-5.274-5.273c-.39-.352-.39-.938 0-1.329.352-.351.938-.351 1.329 0l5.273 5.313v-4.023c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v6.25c0 .546-.43.937-.937.937z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowDownRightBoldIcon);
export default ForwardRef;
