import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleZeroFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m0-15c-2.07 0-3.75 1.68-3.75 3.75v2.5a3.751 3.751 0 0 0 7.5 0v-2.5c0-2.07-1.68-3.75-3.75-3.75m-1.875 3.75c0-1.016.82-1.875 1.875-1.875 1.016 0 1.875.86 1.875 1.875v2.5c0 1.055-.86 1.875-1.875 1.875a1.85 1.85 0 0 1-1.875-1.875z' })));
const ForwardRef = forwardRef(StandaloneCircleZeroFillIcon);
export default ForwardRef;
