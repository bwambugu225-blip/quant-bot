import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBarsFilterFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 10.25C7.25 9.586 7.797 9 8.5 9h15c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-15c-.703 0-1.25-.547-1.25-1.25m2.5 6.25c0-.664.547-1.25 1.25-1.25h10c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11c-.703 0-1.25-.547-1.25-1.25m8.75 6.25c0 .703-.586 1.25-1.25 1.25h-2.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h2.5c.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneBarsFilterFillIcon);
export default ForwardRef;
