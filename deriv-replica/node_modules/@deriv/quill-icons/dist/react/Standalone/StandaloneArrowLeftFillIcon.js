import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowLeftFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm7.602 15.64 6.25-6.25a1.205 1.205 0 0 1 1.757 0c.508.47.508 1.29 0 1.758l-4.101 4.102H23.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11.508l4.101 4.14c.508.47.508 1.29 0 1.758a1.205 1.205 0 0 1-1.757 0l-6.25-6.25a1.205 1.205 0 0 1 0-1.757' })));
const ForwardRef = forwardRef(StandaloneArrowLeftFillIcon);
export default ForwardRef;
