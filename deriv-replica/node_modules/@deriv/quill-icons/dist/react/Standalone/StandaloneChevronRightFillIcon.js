import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.86 15.64c.507.47.507 1.29 0 1.758l-7.5 7.5a1.205 1.205 0 0 1-1.758 0 1.205 1.205 0 0 1 0-1.757l6.601-6.641-6.601-6.602a1.205 1.205 0 0 1 0-1.757 1.205 1.205 0 0 1 1.757 0z' })));
const ForwardRef = forwardRef(StandaloneChevronRightFillIcon);
export default ForwardRef;
