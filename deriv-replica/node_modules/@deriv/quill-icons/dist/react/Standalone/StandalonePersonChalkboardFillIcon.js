import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePersonChalkboardFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 10.25a1.87 1.87 0 0 1-1.64-.937c-.352-.547-.352-1.29 0-1.876.35-.546.937-.937 1.64-.937.664 0 1.25.39 1.602.938.351.585.351 1.328 0 1.875-.352.585-.938.937-1.602.937m-.312 15c0 .703-.586 1.25-1.25 1.25-.704 0-1.25-.547-1.25-1.25v-8.71l-1.133 1.874a1.264 1.264 0 0 1-1.72.43 1.264 1.264 0 0 1-.429-1.719l2.266-3.79c.703-1.132 1.914-1.835 3.242-1.835H16V8.375c0-1.016.82-1.875 1.875-1.875h8.75c1.016 0 1.875.86 1.875 1.875v8.75c0 1.055-.86 1.875-1.875 1.875h-8.75A1.85 1.85 0 0 1 16 17.125V15.25h2.5v1.25H26V9h-7.5v2.5h.625c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-5.312v11.25c0 .703-.586 1.25-1.25 1.25-.704 0-1.25-.547-1.25-1.25v-5h-.626z' })));
const ForwardRef = forwardRef(StandalonePersonChalkboardFillIcon);
export default ForwardRef;
