import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUserCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 11.5c0-1.758.938-3.398 2.5-4.297 1.523-.898 3.438-.898 5 0 1.523.899 2.5 2.54 2.5 4.297 0 1.797-.977 3.438-2.5 4.336-1.562.898-3.477.898-5 0a4.97 4.97 0 0 1-2.5-4.336M3.5 25.367c0-3.867 3.086-6.992 6.953-6.992h3.555A6.985 6.985 0 0 1 21 25.367c0 .625-.547 1.133-1.172 1.133H4.633A1.134 1.134 0 0 1 3.5 25.367m24.414-11.953-5 5c-.39.39-.977.39-1.328 0l-2.5-2.5a.856.856 0 0 1 0-1.289c.352-.39.937-.39 1.328 0l1.836 1.836 4.336-4.375a.92.92 0 0 1 1.289 0c.39.39.39.976 0 1.328z' })));
const ForwardRef = forwardRef(StandaloneUserCheckFillIcon);
export default ForwardRef;
