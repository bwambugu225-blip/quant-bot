import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBookmarkBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 8.375c0-1.016.82-1.875 1.875-1.875v17.265l5.078-3.632c.313-.235.742-.235 1.094 0l5.078 3.633V8.375h-11.25V6.5h11.25c1.016 0 1.875.86 1.875 1.875v17.188c0 .351-.195.703-.508.859a.97.97 0 0 1-.976-.078L16 22.047l-6.055 4.297a.9.9 0 0 1-.937.078c-.313-.156-.508-.508-.508-.86z' })));
const ForwardRef = forwardRef(StandaloneBookmarkBoldIcon);
export default ForwardRef;
