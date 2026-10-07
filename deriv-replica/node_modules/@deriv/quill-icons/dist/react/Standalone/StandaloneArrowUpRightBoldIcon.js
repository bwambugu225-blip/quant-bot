import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.313 10.25a.95.95 0 0 1 .937.938v9.375c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-7.11l-9.023 9.024c-.391.39-.977.39-1.329 0a.856.856 0 0 1 0-1.29l9.024-9.023h-7.11a.925.925 0 0 1-.937-.937c0-.547.39-.938.938-.938h9.375z' })));
const ForwardRef = forwardRef(StandaloneArrowUpRightBoldIcon);
export default ForwardRef;
