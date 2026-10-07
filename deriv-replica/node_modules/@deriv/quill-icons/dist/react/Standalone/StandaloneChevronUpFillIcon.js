import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.102 10.64a1.205 1.205 0 0 1 1.757 0l7.5 7.5c.508.47.508 1.29 0 1.758a1.205 1.205 0 0 1-1.757 0L16 13.297l-6.64 6.601a1.205 1.205 0 0 1-1.758 0 1.205 1.205 0 0 1 0-1.757z' })));
const ForwardRef = forwardRef(StandaloneChevronUpFillIcon);
export default ForwardRef;
