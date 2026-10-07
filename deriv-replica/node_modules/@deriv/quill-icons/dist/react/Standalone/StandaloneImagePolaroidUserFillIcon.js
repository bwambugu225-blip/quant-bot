import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneImagePolaroidUserFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 10.25c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm2.5 1.25V19c0 .703.547 1.25 1.25 1.25h.625c0-1.367 1.094-2.5 2.5-2.5h3.75c1.367 0 2.5 1.133 2.5 2.5H21c.664 0 1.25-.547 1.25-1.25v-7.5c0-.664-.586-1.25-1.25-1.25H11c-.703 0-1.25.586-1.25 1.25M13.5 14c0-.86.469-1.68 1.25-2.148.742-.43 1.719-.43 2.5 0 .742.468 1.25 1.289 1.25 2.148 0 .898-.508 1.719-1.25 2.188-.781.43-1.758.43-2.5 0A2.54 2.54 0 0 1 13.5 14' })));
const ForwardRef = forwardRef(StandaloneImagePolaroidUserFillIcon);
export default ForwardRef;
