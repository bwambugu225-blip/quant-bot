import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCaretDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16 19.39 3.477-3.515h-6.993zm.86 1.758a1.205 1.205 0 0 1-1.758 0l-5-5a1.26 1.26 0 0 1-.274-1.367A1.28 1.28 0 0 1 11 14h10c.469 0 .938.313 1.133.781a1.26 1.26 0 0 1-.274 1.367z' })));
const ForwardRef = forwardRef(StandaloneCaretDownBoldIcon);
export default ForwardRef;
