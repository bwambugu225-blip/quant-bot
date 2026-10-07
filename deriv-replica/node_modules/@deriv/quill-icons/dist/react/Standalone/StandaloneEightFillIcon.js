import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.625 12.75a5 5 0 0 1-1.406 3.477c1.21.937 2.031 2.382 2.031 4.023 0 2.773-2.266 5-5 5h-2.5c-2.773 0-5-2.227-5-5 0-1.64.781-3.086 2.031-4.023-.898-.899-1.406-2.11-1.406-3.477 0-2.734 2.227-5 5-5h1.25c2.734 0 5 2.266 5 5m-5 5H14.75a2.49 2.49 0 0 0-2.5 2.5c0 1.406 1.094 2.5 2.5 2.5h2.5c1.367 0 2.5-1.094 2.5-2.5 0-1.367-1.133-2.5-2.5-2.5zm0-2.5c1.367 0 2.5-1.094 2.5-2.5 0-1.367-1.133-2.5-2.5-2.5h-1.25a2.49 2.49 0 0 0-2.5 2.5c0 1.406 1.094 2.5 2.5 2.5z' })));
const ForwardRef = forwardRef(StandaloneEightFillIcon);
export default ForwardRef;
