import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEllipsisBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.875 0a1.87 1.87 0 0 1-.938-1.64c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.875 0 .546.352.937.938.937 1.602m-6.25 0c0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.875 0a1.87 1.87 0 0 1-.938-1.64c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.874 0 .547.352.938.938.938 1.602M9.75 18.375a1.87 1.87 0 0 1-1.64-.937c-.352-.547-.352-1.29 0-1.875.35-.547.937-.938 1.64-.938.664 0 1.25.39 1.602.938.351.585.351 1.328 0 1.874-.352.586-.938.938-1.602.938' })));
const ForwardRef = forwardRef(StandaloneEllipsisBoldIcon);
export default ForwardRef;
