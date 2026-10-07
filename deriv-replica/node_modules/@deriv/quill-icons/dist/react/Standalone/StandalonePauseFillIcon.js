import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePauseFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.625 9h1.25c1.016 0 1.875.86 1.875 1.875v11.25c0 1.055-.86 1.875-1.875 1.875h-1.25a1.85 1.85 0 0 1-1.875-1.875v-11.25C9.75 9.859 10.57 9 11.625 9m7.5 0h1.25c1.016 0 1.875.86 1.875 1.875v11.25c0 1.055-.86 1.875-1.875 1.875h-1.25a1.85 1.85 0 0 1-1.875-1.875v-11.25c0-1.016.82-1.875 1.875-1.875' })));
const ForwardRef = forwardRef(StandalonePauseFillIcon);
export default ForwardRef;
