import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePenFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M20.14 7.281a2.523 2.523 0 0 1 3.555 0l1.524 1.524a2.523 2.523 0 0 1 0 3.554l-1.875 1.875-5.078-5.078zm-2.773 2.774 5.078 5.078-9.101 9.101c-.39.391-.899.703-1.446.86L7.172 26.5a.89.89 0 0 1-.899-.273.8.8 0 0 1-.234-.899l1.367-4.726a3.4 3.4 0 0 1 .86-1.446z' })));
const ForwardRef = forwardRef(StandalonePenFillIcon);
export default ForwardRef;
