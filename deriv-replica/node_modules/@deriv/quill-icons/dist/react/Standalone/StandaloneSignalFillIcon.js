import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSignalFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26 6.5c.664 0 1.25.586 1.25 1.25v17.5c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V7.75c0-.664.547-1.25 1.25-1.25m-5 3.75c.664 0 1.25.586 1.25 1.25v13.75c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V11.5c0-.664.547-1.25 1.25-1.25m-3.75 5v10c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-10c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25M11 17.75c.664 0 1.25.586 1.25 1.25v6.25c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V19c0-.664.547-1.25 1.25-1.25m-3.75 5v2.5c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-2.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneSignalFillIcon);
export default ForwardRef;
