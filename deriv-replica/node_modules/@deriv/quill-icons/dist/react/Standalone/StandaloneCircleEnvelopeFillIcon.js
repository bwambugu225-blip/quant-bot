import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleEnvelopeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5M11 14v.39l4.648 2.11c.118.04.235.078.352.078a.7.7 0 0 0 .313-.078L21 14.39V14c0-.664-.586-1.25-1.25-1.25h-7.5c-.703 0-1.25.586-1.25 1.25m5.82 3.633a1.95 1.95 0 0 1-.82.195c-.312 0-.586-.078-.86-.195L11 15.758V19c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25v-3.242z' })));
const ForwardRef = forwardRef(StandaloneCircleEnvelopeFillIcon);
export default ForwardRef;
