import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLocationDotRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 14c0-3.437-2.812-6.25-6.25-6.25A6.243 6.243 0 0 0 9.75 14c0 .625.195 1.445.625 2.5a21.6 21.6 0 0 0 1.719 3.203c1.328 2.149 2.89 4.219 3.906 5.469.977-1.25 2.54-3.32 3.906-5.469.664-1.094 1.25-2.187 1.68-3.203.43-1.055.664-1.875.664-2.5m1.25 0c0 3.438-4.57 9.492-6.602 12.031a1.178 1.178 0 0 1-1.835 0C13.07 23.492 8.5 17.438 8.5 14c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5m-9.375 0c0 .703.352 1.29.938 1.64.546.352 1.289.352 1.874 0 .547-.35.938-.937.938-1.64 0-.664-.39-1.25-.937-1.602-.586-.351-1.329-.351-1.875 0-.586.352-.938.938-.938 1.602M16 17.125a3.16 3.16 0 0 1-2.734-1.562c-.547-.938-.547-2.149 0-3.126.586-.937 1.601-1.562 2.734-1.562 1.094 0 2.11.625 2.695 1.563.547.976.547 2.187 0 3.124-.586.977-1.601 1.563-2.695 1.563' })));
const ForwardRef = forwardRef(StandaloneLocationDotRegularIcon);
export default ForwardRef;
