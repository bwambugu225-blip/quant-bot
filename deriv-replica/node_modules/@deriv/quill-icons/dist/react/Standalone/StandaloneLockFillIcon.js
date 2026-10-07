import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLockFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 12.125V14h6.25v-1.875A3.134 3.134 0 0 0 16 9a3.11 3.11 0 0 0-3.125 3.125M10.375 14v-1.875c0-3.086 2.5-5.625 5.625-5.625 3.086 0 5.625 2.54 5.625 5.625V14h.625c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5v-7.5c0-1.367 1.094-2.5 2.5-2.5z' })));
const ForwardRef = forwardRef(StandaloneLockFillIcon);
export default ForwardRef;
