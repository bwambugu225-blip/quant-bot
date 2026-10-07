import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFiveFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 8.805c.117-.586.625-1.055 1.25-1.055h7.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-6.484l-.782 4.375h4.454a5.32 5.32 0 0 1 5.312 5.313 5.293 5.293 0 0 1-5.312 5.312h-3.282c-1.523 0-2.93-.86-3.633-2.227l-.156-.312a1.24 1.24 0 0 1 .547-1.68 1.24 1.24 0 0 1 1.68.547l.156.313c.273.547.82.859 1.406.859h3.281a2.826 2.826 0 0 0 2.813-2.812c0-1.524-1.29-2.813-2.812-2.813H11a1.27 1.27 0 0 1-.977-.43c-.234-.273-.351-.664-.273-1.015z' })));
const ForwardRef = forwardRef(StandaloneFiveFillIcon);
export default ForwardRef;
