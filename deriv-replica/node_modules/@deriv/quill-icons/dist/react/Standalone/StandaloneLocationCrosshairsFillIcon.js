import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLocationCrosshairsFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c.664 0 1.25.586 1.25 1.25v1.367a7.56 7.56 0 0 1 6.133 6.133h1.367c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-1.367a7.56 7.56 0 0 1-6.133 6.172v1.328c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-1.328a7.555 7.555 0 0 1-6.172-6.172H7.25c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.328a7.56 7.56 0 0 1 6.172-6.133V7.75c0-.664.547-1.25 1.25-1.25m-5 10a4.97 4.97 0 0 0 2.5 4.336c1.523.898 3.438.898 5 0 1.523-.898 2.5-2.54 2.5-4.336 0-1.758-.977-3.398-2.5-4.297-1.562-.898-3.477-.898-5 0A4.96 4.96 0 0 0 11 16.5m5-3.125c1.094 0 2.11.625 2.695 1.563.547.976.547 2.187 0 3.124-.586.977-1.601 1.563-2.695 1.563a3.16 3.16 0 0 1-2.734-1.562c-.547-.938-.547-2.149 0-3.125.586-.938 1.601-1.563 2.734-1.563' })));
const ForwardRef = forwardRef(StandaloneLocationCrosshairsFillIcon);
export default ForwardRef;
