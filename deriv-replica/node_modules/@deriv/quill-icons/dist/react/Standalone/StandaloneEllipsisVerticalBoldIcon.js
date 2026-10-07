import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEllipsisVerticalBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 20.875c.664 0 1.25.39 1.602.938.351.585.351 1.328 0 1.875-.352.585-.938.937-1.602.937a1.87 1.87 0 0 1-1.64-.937c-.352-.547-.352-1.29 0-1.875.35-.547.937-.938 1.64-.938m0-6.25c.664 0 1.25.39 1.602.938.351.585.351 1.328 0 1.874-.352.586-.938.938-1.602.938a1.87 1.87 0 0 1-1.64-.937c-.352-.547-.352-1.29 0-1.875.35-.547.937-.938 1.64-.938m1.875-4.375c0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.875 0a1.87 1.87 0 0 1-.938-1.64c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.874 0 .547.352.938.938.938 1.602' })));
const ForwardRef = forwardRef(StandaloneEllipsisVerticalBoldIcon);
export default ForwardRef;
