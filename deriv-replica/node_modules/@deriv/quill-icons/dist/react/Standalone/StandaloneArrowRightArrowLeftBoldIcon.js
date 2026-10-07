import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRightArrowLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm11.273 25.914-3.75-3.75c-.39-.352-.39-.937 0-1.328l3.75-3.711a.856.856 0 0 1 1.29 0c.39.352.39.938 0 1.29l-2.149 2.148h13.399a.95.95 0 0 1 .937.937c0 .547-.43.938-.937.938l-13.399.039 2.149 2.148c.39.352.39.938 0 1.29a.856.856 0 0 1-1.29 0m13.204-13.75-3.75 3.75c-.391.39-.977.39-1.329 0-.39-.351-.39-.937 0-1.328l2.149-2.149H8.187c-.546 0-.937-.39-.937-.937 0-.508.39-.937.938-.937h13.359l-2.149-2.149c-.39-.351-.39-.937 0-1.328.352-.352.938-.352 1.329 0l3.75 3.789a.92.92 0 0 1 0 1.29' })));
const ForwardRef = forwardRef(StandaloneArrowRightArrowLeftBoldIcon);
export default ForwardRef;
