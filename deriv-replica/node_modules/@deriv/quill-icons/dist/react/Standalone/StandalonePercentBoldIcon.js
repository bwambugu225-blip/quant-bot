import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePercentBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm22.914 10.914-12.539 12.5a.856.856 0 0 1-1.29 0c-.39-.352-.39-.937 0-1.328l12.5-12.461c.352-.39.938-.39 1.33 0a.92.92 0 0 1 0 1.29m-10.039.586c0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.876 0a1.87 1.87 0 0 1-.937-1.64c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.874 0 .547.352.938.938.938 1.602m10 10c0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.875 0a1.87 1.87 0 0 1-.938-1.64c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.875 0 .546.352.937.938.937 1.602' })));
const ForwardRef = forwardRef(StandalonePercentBoldIcon);
export default ForwardRef;
