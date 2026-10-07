import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMinusFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0 .703-.586 1.25-1.25 1.25H9.125c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h13.75c.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneMinusFillIcon);
export default ForwardRef;
