import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleBookmarkBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 8.375c-2.93 0-5.586 1.563-7.07 4.063-1.446 2.539-1.446 5.624 0 8.124A8.13 8.13 0 0 0 16 24.626c2.89 0 5.547-1.523 7.031-4.062 1.446-2.5 1.446-5.586 0-8.125-1.484-2.5-4.14-4.063-7.031-4.063M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-3.75-13.125c0-1.016.82-1.875 1.875-1.875h3.75c1.016 0 1.875.86 1.875 1.875v7.5c0 .273-.156.469-.39.586a.53.53 0 0 1-.626-.078L16 19.195l-2.734 2.188c-.196.156-.47.156-.664.078q-.352-.176-.352-.586z' })));
const ForwardRef = forwardRef(StandaloneCircleBookmarkBoldIcon);
export default ForwardRef;
