import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm10.336 15.836 7.5-7.461c.352-.39.937-.39 1.328 0a.92.92 0 0 1 0 1.29L12.29 16.5l6.836 6.875c.39.352.39.938 0 1.29a.856.856 0 0 1-1.29 0l-7.5-7.5c-.39-.352-.39-.938 0-1.33' })));
const ForwardRef = forwardRef(StandaloneChevronLeftBoldIcon);
export default ForwardRef;
