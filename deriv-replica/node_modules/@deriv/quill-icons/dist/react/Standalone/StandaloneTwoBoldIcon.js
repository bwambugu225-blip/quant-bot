import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTwoBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.492 9.625c-1.055 0-2.031.43-2.773 1.172l-1.367 1.367c-.391.39-.977.39-1.329 0a.856.856 0 0 1 0-1.289l1.368-1.406a5.83 5.83 0 0 1 4.101-1.719h.274c3.047 0 5.547 2.5 5.547 5.547 0 1.523-.665 2.969-1.758 4.023l-6.524 6.055h8.282a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H10.688a.99.99 0 0 1-.899-.586.98.98 0 0 1 .234-1.016l8.243-7.695c.742-.703 1.172-1.68 1.172-2.656a3.67 3.67 0 0 0-3.672-3.672z' })));
const ForwardRef = forwardRef(StandaloneTwoBoldIcon);
export default ForwardRef;
