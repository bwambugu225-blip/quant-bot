import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartOhlcFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c.664 0 1.25.586 1.25 1.25V9h1.25c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-1.25v11.25c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V21.5H13.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.25V7.75c0-.664.547-1.25 1.25-1.25M7.875 14c.664 0 1.25.586 1.25 1.25v6.25h1.25c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-1.25v1.25c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V19h-1.25c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.25v-1.25c0-.664.547-1.25 1.25-1.25m16.25-5c.664 0 1.25.586 1.25 1.25v6.25h1.25c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-1.25v1.25c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V14h-1.25c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.25v-1.25c0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneChartOhlcFillIcon);
export default ForwardRef;
