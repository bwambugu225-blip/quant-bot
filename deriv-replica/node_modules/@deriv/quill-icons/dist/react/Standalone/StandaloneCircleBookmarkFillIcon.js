import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleBookmarkFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-3.75-13.125v7.5q0 .41.352.586c.195.117.468.078.664-.078L16 19.195l2.734 2.188c.157.156.43.156.625.078.235-.117.391-.313.391-.586v-7.5c0-1.016-.86-1.875-1.875-1.875h-3.75c-1.055 0-1.875.86-1.875 1.875' })));
const ForwardRef = forwardRef(StandaloneCircleBookmarkFillIcon);
export default ForwardRef;
