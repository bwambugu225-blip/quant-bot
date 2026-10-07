import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSquareCheckRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 9c-.703 0-1.25.586-1.25 1.25v12.5c0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25v-12.5c0-.664-.586-1.25-1.25-1.25zm-2.5 1.25c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5zm12.93 4.219-5 5a.66.66 0 0 1-.899 0l-2.5-2.5a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l2.07 2.07 4.531-4.57a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899' })));
const ForwardRef = forwardRef(StandaloneSquareCheckRegularIcon);
export default ForwardRef;
