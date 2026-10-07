import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartMixedFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm25.531 9.977-6.25 5c-.468.39-1.093.39-1.562.039L13.5 11.852l-5.469 4.375a1.245 1.245 0 0 1-1.758-.196c-.43-.508-.351-1.328.196-1.758l6.25-5c.43-.351 1.054-.351 1.523 0l4.219 3.165 5.508-4.415c.508-.43 1.328-.312 1.758.196.43.547.312 1.328-.196 1.758M12.25 16.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25zm-5 3.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25zm11.25-2.5c.664 0 1.25.586 1.25 1.25v5c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-5c0-.664.547-1.25 1.25-1.25m3.75-1.25c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneChartMixedFillIcon);
export default ForwardRef;
