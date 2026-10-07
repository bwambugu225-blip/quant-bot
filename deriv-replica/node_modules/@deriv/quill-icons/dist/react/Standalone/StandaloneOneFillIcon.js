import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneOneFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.25 9v13.75h2.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-7.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h2.5V11.344l-1.836 1.21c-.547.391-1.328.235-1.719-.35-.39-.587-.234-1.329.352-1.72l3.75-2.5c.39-.273.86-.273 1.289-.078.39.235.664.664.664 1.094' })));
const ForwardRef = forwardRef(StandaloneOneFillIcon);
export default ForwardRef;
