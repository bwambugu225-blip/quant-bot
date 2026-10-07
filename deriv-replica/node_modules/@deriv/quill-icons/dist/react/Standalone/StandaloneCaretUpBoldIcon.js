import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCaretUpBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16 13.648-3.516 3.477h6.993zm-.898-1.757a1.205 1.205 0 0 1 1.757 0l5 5c.352.351.47.898.274 1.367A1.19 1.19 0 0 1 21 19H11c-.508 0-.977-.273-1.172-.742a1.26 1.26 0 0 1 .274-1.367z' })));
const ForwardRef = forwardRef(StandaloneCaretUpBoldIcon);
export default ForwardRef;
