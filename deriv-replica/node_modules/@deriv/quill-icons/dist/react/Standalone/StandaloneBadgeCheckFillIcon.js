import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBadgeCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c1.406 0 2.656.82 3.281 2.031a3.72 3.72 0 0 1 3.79.899 3.72 3.72 0 0 1 .898 3.789C25.179 13.844 26 15.094 26 16.5a3.73 3.73 0 0 1-2.031 3.32 3.65 3.65 0 0 1-.899 3.75c-1.015 1.016-2.5 1.328-3.789.938A3.68 3.68 0 0 1 16 26.5c-1.445 0-2.695-.781-3.32-1.992a3.75 3.75 0 0 1-3.75-.938 3.75 3.75 0 0 1-.938-3.75C6.782 19.195 6 17.945 6 16.5a3.68 3.68 0 0 1 1.992-3.281c-.39-1.29-.078-2.774.938-3.79a3.65 3.65 0 0 1 3.75-.898A3.73 3.73 0 0 1 16 6.5m4.414 8.164a.92.92 0 0 0 0-1.289c-.39-.39-.977-.39-1.328 0l-4.336 4.336-1.836-1.836c-.39-.39-.976-.39-1.328 0a.856.856 0 0 0 0 1.29l2.5 2.5c.351.39.937.39 1.328 0z' })));
const ForwardRef = forwardRef(StandaloneBadgeCheckFillIcon);
export default ForwardRef;
