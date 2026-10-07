import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRotateLeftFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.883 12.75h1.992c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-5c-.703 0-1.25-.547-1.25-1.25V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v2.031l.664-.703a8.794 8.794 0 0 1 12.383 0 8.794 8.794 0 0 1 0 12.383 8.794 8.794 0 0 1-12.383 0c-.469-.508-.469-1.29 0-1.758.508-.508 1.29-.508 1.758 0a6.32 6.32 0 0 0 8.867 0 6.32 6.32 0 0 0 0-8.867 6.32 6.32 0 0 0-8.867 0z' })));
const ForwardRef = forwardRef(StandaloneArrowRotateLeftFillIcon);
export default ForwardRef;
