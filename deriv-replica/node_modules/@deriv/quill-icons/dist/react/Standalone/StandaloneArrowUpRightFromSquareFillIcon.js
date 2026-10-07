import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpRightFromSquareFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 6.5h6.25c.664 0 1.25.586 1.25 1.25V14c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-3.203l-7.89 7.851a1.205 1.205 0 0 1-1.758 0 1.205 1.205 0 0 1 0-1.757L21.703 9H18.5c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25M9.125 7.75H13.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H9.125a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625V19c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v4.375a3.11 3.11 0 0 1-3.125 3.125h-12.5C7.367 26.5 6 25.133 6 23.375v-12.5A3.11 3.11 0 0 1 9.125 7.75' })));
const ForwardRef = forwardRef(StandaloneArrowUpRightFromSquareFillIcon);
export default ForwardRef;
