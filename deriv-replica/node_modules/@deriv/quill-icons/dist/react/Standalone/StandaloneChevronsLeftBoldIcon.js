import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronsLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm7.836 15.836 7.5-7.461c.351-.39.937-.39 1.328 0a.92.92 0 0 1 0 1.29L9.79 16.5l6.836 6.875c.39.352.39.938 0 1.29a.856.856 0 0 1-1.29 0l-7.5-7.5c-.39-.352-.39-.938 0-1.33m15-7.5v.039c.352-.39.937-.39 1.328 0a.92.92 0 0 1 0 1.29l-6.875 6.874 6.836 6.836c.39.352.39.938 0 1.29a.856.856 0 0 1-1.29 0l-7.5-7.5c-.39-.352-.39-.938 0-1.33z' })));
const ForwardRef = forwardRef(StandaloneChevronsLeftBoldIcon);
export default ForwardRef;
