import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowsRotateRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.695 14.742a.66.66 0 0 1-.625.508c-.39 0-.703-.312-.625-.703C8.344 10.68 11.82 7.75 16 7.75c3.164 0 5.938 1.719 7.5 4.258V9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v3.75a.64.64 0 0 1-.625.625h-3.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h2.11a7.502 7.502 0 0 0-13.79 1.992m14.57 3.555c.079-.313.352-.547.665-.547.351 0 .664.352.586.742C23.617 22.36 20.14 25.25 16 25.25a8.7 8.7 0 0 1-7.5-4.219v2.344a.617.617 0 0 1-.625.625.617.617 0 0 1-.625-.625v-3.75c0-.312.273-.625.625-.625h3.75c.352 0 .625.313.625.625a.617.617 0 0 1-.625.625H9.477C10.766 22.516 13.187 24 16 24c3.516 0 6.484-2.422 7.266-5.703' })));
const ForwardRef = forwardRef(StandaloneArrowsRotateRegularIcon);
export default ForwardRef;
