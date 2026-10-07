import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCopyFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.375 6.5h4.844c.468 0 .976.234 1.328.586l2.617 2.617c.352.352.586.86.586 1.328v8.594c0 1.055-.86 1.875-1.875 1.875h-7.5a1.85 1.85 0 0 1-1.875-1.875V8.375c0-1.016.82-1.875 1.875-1.875m-6.25 5h3.125V14h-2.5v10h7.5v-1.25h2.5v1.875c0 1.055-.86 1.875-1.875 1.875h-8.75a1.85 1.85 0 0 1-1.875-1.875v-11.25c0-1.016.82-1.875 1.875-1.875' })));
const ForwardRef = forwardRef(StandaloneCopyFillIcon);
export default ForwardRef;
