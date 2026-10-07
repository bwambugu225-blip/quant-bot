import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUserFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 16.5a4.97 4.97 0 0 1-4.336-2.5c-.898-1.523-.898-3.437 0-5 .899-1.523 2.54-2.5 4.336-2.5 1.758 0 3.398.977 4.297 2.5.898 1.563.898 3.477 0 5A4.96 4.96 0 0 1 16 16.5m-1.797 1.875h3.555a6.985 6.985 0 0 1 6.992 6.992c0 .625-.547 1.133-1.172 1.133H8.383a1.134 1.134 0 0 1-1.133-1.133c0-3.867 3.086-6.992 6.953-6.992' })));
const ForwardRef = forwardRef(StandaloneUserFillIcon);
export default ForwardRef;
