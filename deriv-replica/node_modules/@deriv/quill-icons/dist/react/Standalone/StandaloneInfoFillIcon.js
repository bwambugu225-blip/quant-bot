import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneInfoFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.125 9.625c0-.664.352-1.25.938-1.602.546-.351 1.289-.351 1.874 0 .547.352.938.938.938 1.602 0 .703-.39 1.29-.937 1.64-.586.352-1.329.352-1.875 0a1.87 1.87 0 0 1-.938-1.64M12.25 15.25c0-.664.547-1.25 1.25-1.25H16c.664 0 1.25.586 1.25 1.25V24h1.25c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.25v-7.5H13.5c-.703 0-1.25-.547-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneInfoFillIcon);
export default ForwardRef;
