import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPlayFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M4 2.996c0-.806 1.001-1.277 1.726-.812l7.81 5.004c.619.396.619 1.228 0 1.624l-7.81 5.004C5.001 14.281 4 13.81 4 13.004z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyPlayFillIcon);
export default ForwardRef;
