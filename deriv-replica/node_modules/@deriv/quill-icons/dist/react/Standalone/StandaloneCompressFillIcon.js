import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCompressFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.5 9v3.75c0 .703-.586 1.25-1.25 1.25H8.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25H11V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25m-5 10h3.75c.664 0 1.25.586 1.25 1.25V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-2.5H8.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25M21 9v2.5h2.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-3.75c-.703 0-1.25-.547-1.25-1.25V9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25m-1.25 10h3.75c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H21V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-3.75c0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneCompressFillIcon);
export default ForwardRef;
