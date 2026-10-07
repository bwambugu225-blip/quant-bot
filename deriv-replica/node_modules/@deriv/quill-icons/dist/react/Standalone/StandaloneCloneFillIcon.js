import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCloneFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.25 24v-2.5h2.5V24c0 1.406-1.133 2.5-2.5 2.5H8.5A2.47 2.47 0 0 1 6 24v-8.75c0-1.367 1.094-2.5 2.5-2.5H11v2.5H8.5V24zm-2.5-3.75a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h8.75C24.867 6.5 26 7.633 26 9v8.75c0 1.406-1.133 2.5-2.5 2.5z' })));
const ForwardRef = forwardRef(StandaloneCloneFillIcon);
export default ForwardRef;
