import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUnlockFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 12.125V14h9.375c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5v-7.5c0-1.367 1.094-2.5 2.5-2.5h.625v-1.875c0-3.086 2.5-5.625 5.625-5.625 2.227 0 4.18 1.328 5.078 3.242.274.625 0 1.367-.625 1.64-.586.313-1.367.04-1.64-.585C18.305 9.742 17.21 9 16 9a3.11 3.11 0 0 0-3.125 3.125' })));
const ForwardRef = forwardRef(StandaloneUnlockFillIcon);
export default ForwardRef;
