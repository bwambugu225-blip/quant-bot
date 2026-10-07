import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRotateLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.563 15.25c-.547 0-.938-.39-.938-.937V8.686c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938v3.164l.781-.938C10.883 9 13.266 7.75 16 7.75c4.805 0 8.75 3.945 8.75 8.75 0 4.844-3.945 8.75-8.75 8.75a8.8 8.8 0 0 1-5.273-1.719c-.391-.312-.508-.898-.196-1.328a.94.94 0 0 1 1.328-.195A6.84 6.84 0 0 0 16 23.375a6.86 6.86 0 0 0 6.875-6.875c0-3.79-3.086-6.875-6.875-6.875-2.148 0-4.023.977-5.312 2.5l-1.055 1.25h3.555a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937z' })));
const ForwardRef = forwardRef(StandaloneArrowRotateLeftBoldIcon);
export default ForwardRef;
