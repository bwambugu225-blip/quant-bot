import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileShieldFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 9c0-1.367 1.094-2.5 2.5-2.5h6.25v5c0 .703.547 1.25 1.25 1.25h5v1.836l-3.633 1.484c-.86.313-1.367 1.133-1.367 2.032 0 2.187.703 5.78 3.672 8.125-.352.195-.781.273-1.172.273h-10a2.47 2.47 0 0 1-2.5-2.5zm15 2.5h-5v-5zm1.523 3.828a.97.97 0 0 1 .665 0l4.687 1.875c.39.156.625.508.625.86 0 2.5-1.016 6.601-5.273 8.398a1.2 1.2 0 0 1-.743 0C16.977 24.664 16 20.563 16 18.063c0-.352.234-.704.586-.86zm4.063 3.36-3.711-1.485v7.344c2.656-1.29 3.555-3.867 3.71-5.86' })));
const ForwardRef = forwardRef(StandaloneFileShieldFillIcon);
export default ForwardRef;
