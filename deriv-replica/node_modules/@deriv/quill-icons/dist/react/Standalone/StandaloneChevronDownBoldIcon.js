import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.336 22.164-7.5-7.5c-.39-.351-.39-.937 0-1.328.351-.352.937-.352 1.328 0L16 20.21l6.836-6.836c.352-.39.937-.39 1.328 0a.92.92 0 0 1 0 1.29l-7.539 7.5a.856.856 0 0 1-1.29 0' })));
const ForwardRef = forwardRef(StandaloneChevronDownBoldIcon);
export default ForwardRef;
