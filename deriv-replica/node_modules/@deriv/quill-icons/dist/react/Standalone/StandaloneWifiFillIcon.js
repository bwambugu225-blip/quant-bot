import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWifiFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M5.61 14.43c-.508.508-1.29.468-1.798-.04-.468-.468-.43-1.288.04-1.757C7.016 9.625 11.273 7.75 16 7.75c4.688 0 8.945 1.875 12.11 4.883.468.469.507 1.289.038 1.758-.507.507-1.289.547-1.796.039-2.696-2.578-6.329-4.18-10.352-4.18-4.062 0-7.695 1.602-10.39 4.18M16 16.5c-2.227 0-4.258.86-5.82 2.188a1.24 1.24 0 0 1-1.758-.079c-.43-.547-.39-1.328.117-1.797C10.531 15.095 13.15 14 16 14s5.43 1.094 7.422 2.813c.508.468.586 1.25.117 1.796a1.24 1.24 0 0 1-1.758.078C20.22 17.36 18.188 16.5 16 16.5m2.5 6.25c0 .898-.508 1.719-1.25 2.188-.781.43-1.758.43-2.5 0a2.54 2.54 0 0 1-1.25-2.188c0-.86.469-1.68 1.25-2.148.742-.43 1.719-.43 2.5 0 .742.468 1.25 1.289 1.25 2.148' })));
const ForwardRef = forwardRef(StandaloneWifiFillIcon);
export default ForwardRef;
