import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePlaceholderFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 7.75h1.25v2.5H11c-.703 0-1.25.586-1.25 1.25v1.25h-2.5V11.5c0-2.07 1.68-3.75 3.75-3.75M7.25 14h2.5v5h-2.5zm15 0h2.5v5h-2.5zm2.5-1.25h-2.5V11.5c0-.664-.586-1.25-1.25-1.25h-1.25v-2.5H21c2.07 0 3.75 1.68 3.75 3.75zm0 7.5v1.25c0 2.07-1.68 3.75-3.75 3.75h-1.25v-2.5H21c.664 0 1.25-.547 1.25-1.25v-1.25zm-15 0v1.25c0 .703.547 1.25 1.25 1.25h1.25v2.5H11c-2.07 0-3.75-1.68-3.75-3.75v-1.25zm3.75 5v-2.5h5v2.5zm0-15v-2.5h5v2.5z' })));
const ForwardRef = forwardRef(StandalonePlaceholderFillIcon);
export default ForwardRef;
