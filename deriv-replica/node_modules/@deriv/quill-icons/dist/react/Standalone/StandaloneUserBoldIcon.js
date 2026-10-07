import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUserBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.125 11.5c0-1.094-.625-2.11-1.562-2.695-.977-.547-2.188-.547-3.125 0-.977.586-1.563 1.601-1.563 2.695 0 1.133.586 2.148 1.563 2.734.937.547 2.148.547 3.124 0 .938-.586 1.563-1.601 1.563-2.734M11 11.5c0-1.758.938-3.398 2.5-4.297 1.523-.898 3.438-.898 5 0 1.523.899 2.5 2.54 2.5 4.297 0 1.797-.977 3.438-2.5 4.336-1.562.898-3.477.898-5 0A4.97 4.97 0 0 1 11 11.5M9.164 24.625h13.633c-.352-2.46-2.461-4.375-5.04-4.375h-3.554c-2.578 0-4.687 1.914-5.039 4.375m-1.914.742c0-3.867 3.086-6.992 6.953-6.992h3.555a6.985 6.985 0 0 1 6.992 6.992c0 .625-.547 1.133-1.172 1.133H8.383a1.134 1.134 0 0 1-1.133-1.133' })));
const ForwardRef = forwardRef(StandaloneUserBoldIcon);
export default ForwardRef;
