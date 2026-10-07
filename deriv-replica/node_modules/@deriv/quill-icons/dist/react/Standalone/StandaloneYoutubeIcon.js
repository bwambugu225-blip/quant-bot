import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneYoutubeIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26.695 11.383c.47 1.64.47 5.156.47 5.156s0 3.477-.47 5.156a2.6 2.6 0 0 1-1.875 1.875c-1.68.43-8.32.43-8.32.43s-6.68 0-8.36-.43a2.6 2.6 0 0 1-1.874-1.875c-.47-1.68-.47-5.156-.47-5.156s0-3.516.47-5.156A2.66 2.66 0 0 1 8.14 9.469C9.82 9 16.5 9 16.5 9s6.64 0 8.32.469c.899.234 1.64.976 1.875 1.914m-12.382 8.32 5.546-3.164-5.547-3.164z' })));
const ForwardRef = forwardRef(StandaloneYoutubeIcon);
export default ForwardRef;
