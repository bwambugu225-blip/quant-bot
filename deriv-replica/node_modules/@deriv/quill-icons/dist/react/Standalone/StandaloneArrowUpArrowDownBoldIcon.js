import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpArrowDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm25.414 21.227-3.75 3.75c-.39.39-.977.39-1.328 0l-3.75-3.75a.856.856 0 0 1 0-1.29c.352-.39.937-.39 1.328 0l2.148 2.149V8.688c0-.508.391-.938.938-.938a.95.95 0 0 1 .938.938v13.398l2.148-2.148c.352-.391.937-.391 1.328 0a.92.92 0 0 1 0 1.289M11.664 8.023l3.711 3.75c.39.391.39.977 0 1.329-.352.39-.937.39-1.328 0l-2.149-2.149v13.36c0 .546-.39.937-.937.937a.925.925 0 0 1-.938-.937v-13.36l-2.148 2.149a.856.856 0 0 1-1.29 0c-.39-.352-.39-.938 0-1.329l3.75-3.75c.352-.351.938-.351 1.33 0' })));
const ForwardRef = forwardRef(StandaloneArrowUpArrowDownBoldIcon);
export default ForwardRef;
