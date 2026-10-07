import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpToLineFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 7.75h12.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H9.75c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25m7.11 5.39 5 5c.507.47.507 1.29 0 1.758a1.205 1.205 0 0 1-1.758 0l-2.852-2.851V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-6.953l-2.89 2.851a1.205 1.205 0 0 1-1.758 0 1.204 1.204 0 0 1 0-1.757l5-5a1.205 1.205 0 0 1 1.757 0' })));
const ForwardRef = forwardRef(StandaloneArrowUpToLineFillIcon);
export default ForwardRef;
