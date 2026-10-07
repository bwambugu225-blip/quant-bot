import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleThreeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 7.75a8.73 8.73 0 0 0-7.578 4.375c-1.602 2.734-1.602 6.055 0 8.75C9.984 23.609 12.836 25.25 16 25.25a8.63 8.63 0 0 0 7.54-4.375c1.6-2.695 1.6-6.016 0-8.75C21.976 9.43 19.124 7.75 16 7.75m0 18.75c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-3.125-15v.04h5.586c.273 0 .508.155.586.39.117.234.039.508-.156.703l-3.086 2.617h.78a3.134 3.134 0 0 1 3.126 3.125c0 1.758-1.367 3.164-3.125 3.164H15.18a3.48 3.48 0 0 1-2.735-1.367l-.078-.156a.584.584 0 0 1 .117-.86.585.585 0 0 1 .86.117l.117.118c.39.547 1.055.898 1.719.898h1.406c1.055 0 1.875-.86 1.875-1.914 0-1.016-.82-1.875-1.875-1.875h-2.461a.7.7 0 0 1-.625-.39c-.078-.235 0-.508.195-.704l3.086-2.656h-3.906a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneCircleThreeRegularIcon);
export default ForwardRef;
