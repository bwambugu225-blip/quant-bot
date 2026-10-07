import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 6.5h6.25v5c0 .703.547 1.25 1.25 1.25h5V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m7.5 0 5 5h-5zm1.914 10.977h-.039c.39-.352.39-.938 0-1.329a.92.92 0 0 0-1.29 0l-4.374 4.375-1.836-1.835a.856.856 0 0 0-1.29 0 .856.856 0 0 0 0 1.289l2.5 2.5c.352.39.938.39 1.33 0z' })));
const ForwardRef = forwardRef(StandaloneFileCheckFillIcon);
export default ForwardRef;
