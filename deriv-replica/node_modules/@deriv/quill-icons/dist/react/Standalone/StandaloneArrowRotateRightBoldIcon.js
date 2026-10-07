import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRotateRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.438 15.25h-5.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h3.515l-1.055-1.25c-1.289-1.523-3.164-2.5-5.273-2.5A6.86 6.86 0 0 0 9.125 16.5 6.836 6.836 0 0 0 16 23.375a6.8 6.8 0 0 0 4.102-1.367.94.94 0 0 1 1.328.195.94.94 0 0 1-.196 1.328C19.79 24.625 17.954 25.25 16 25.25a8.736 8.736 0 0 1-8.75-8.75c0-4.805 3.906-8.75 8.75-8.75 2.695 0 5.117 1.25 6.719 3.164l.781.938V8.687c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938v5.624c0 .547-.43.938-.937.938' })));
const ForwardRef = forwardRef(StandaloneArrowRotateRightBoldIcon);
export default ForwardRef;
