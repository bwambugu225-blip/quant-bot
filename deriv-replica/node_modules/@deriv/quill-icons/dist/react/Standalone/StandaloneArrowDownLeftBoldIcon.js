import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.688 22.75c-.547 0-.938-.39-.938-.937v-9.375c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v7.148l9.023-9.063a.92.92 0 0 1 1.29 0c.39.391.39.977 0 1.329l-9.024 9.023h7.149a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937z' })));
const ForwardRef = forwardRef(StandaloneArrowDownLeftBoldIcon);
export default ForwardRef;
