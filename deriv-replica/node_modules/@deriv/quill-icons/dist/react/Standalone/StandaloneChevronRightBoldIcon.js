import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronRightBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.664 15.836c.352.39.352.976 0 1.328l-7.5 7.5c-.39.39-.976.39-1.328 0a.856.856 0 0 1 0-1.289l6.836-6.836-6.836-6.875a.856.856 0 0 1 0-1.289.856.856 0 0 1 1.289 0z' })));
const ForwardRef = forwardRef(StandaloneChevronRightBoldIcon);
export default ForwardRef;
