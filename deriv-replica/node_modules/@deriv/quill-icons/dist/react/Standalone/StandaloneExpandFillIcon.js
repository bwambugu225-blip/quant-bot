import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneExpandFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 7.75h3.75c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-2.5v2.5c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V9c0-.664.547-1.25 1.25-1.25m1.25 12.5v2.5h2.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H8.5c-.703 0-1.25-.547-1.25-1.25v-3.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25m10-12.5h3.75c.664 0 1.25.586 1.25 1.25v3.75c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-2.5h-2.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25m5 12.5V24c0 .703-.586 1.25-1.25 1.25h-3.75c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h2.5v-2.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneExpandFillIcon);
export default ForwardRef;
