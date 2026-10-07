import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFloppyDiskFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 7.75h9.453c.664 0 1.328.273 1.797.742l3.008 3.008c.469.469.742 1.133.742 1.797v9.453c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5m0 3.75V14c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25v-2.5c0-.664-.586-1.25-1.25-1.25H11c-.703 0-1.25.586-1.25 1.25M16 17.75c-.898 0-1.719.508-2.187 1.25-.43.781-.43 1.758 0 2.5A2.54 2.54 0 0 0 16 22.75c.86 0 1.68-.469 2.148-1.25.43-.742.43-1.719 0-2.5-.468-.742-1.289-1.25-2.148-1.25' })));
const ForwardRef = forwardRef(StandaloneFloppyDiskFillIcon);
export default ForwardRef;
