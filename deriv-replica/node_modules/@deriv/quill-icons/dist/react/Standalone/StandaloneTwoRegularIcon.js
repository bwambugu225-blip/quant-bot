import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTwoRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.531 9c-1.133 0-2.226.469-3.047 1.25l-1.054 1.094a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l1.094-1.054a5.4 5.4 0 0 1 3.906-1.641C18.5 7.75 21 10.172 21 13.18c0 1.523-.625 2.93-1.719 3.984L11.938 24h9.687c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-11.25c-.273 0-.508-.156-.586-.39a.54.54 0 0 1 .156-.665l8.477-7.968a4.22 4.22 0 0 0 1.328-3.047c0-2.305-1.914-4.18-4.219-4.18' })));
const ForwardRef = forwardRef(StandaloneTwoRegularIcon);
export default ForwardRef;
