import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneShareFromSquareFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 15.25h-1.836c-1.758 0-3.164 1.445-3.164 3.203 0 .86.39 1.328.742 1.563.274.195.508.468.508.82a.7.7 0 0 1-.703.703h-.117a.7.7 0 0 1-.274-.078c-.703-.313-3.906-1.914-3.906-5.586 0-3.086 2.5-5.625 5.625-5.625H18.5V7.867c0-.742.586-1.367 1.328-1.367.352 0 .664.156.899.352l5.43 4.882c.273.274.468.625.468 1.016 0 .43-.195.781-.469 1.055l-5.43 4.883c-.234.234-.546.312-.859.312h-.117c-.703 0-1.25-.547-1.25-1.25zm-10.625-5a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625V21.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v1.875a3.11 3.11 0 0 1-3.125 3.125h-12.5c-1.758 0-3.125-1.367-3.125-3.125v-12.5A3.11 3.11 0 0 1 7.875 7.75H9.75c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25z' })));
const ForwardRef = forwardRef(StandaloneShareFromSquareFillIcon);
export default ForwardRef;
