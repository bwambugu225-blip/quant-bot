import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEnvelopeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.875 9h16.25C25.141 9 26 9.86 26 10.875c0 .625-.312 1.172-.781 1.523l-8.477 6.368a1.23 1.23 0 0 1-1.523 0l-8.477-6.368A1.87 1.87 0 0 1 6 10.875C6 9.859 6.82 9 7.875 9M6 13.375l8.477 6.406a2.52 2.52 0 0 0 3.007 0L26 13.375V21.5c0 1.406-1.133 2.5-2.5 2.5h-15A2.47 2.47 0 0 1 6 21.5z' })));
const ForwardRef = forwardRef(StandaloneEnvelopeFillIcon);
export default ForwardRef;
