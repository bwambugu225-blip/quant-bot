import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePenCircleFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m3.945-14.531c-.586-.586-1.601-.586-2.187 0l-.86.86 2.774 2.773.86-.86c.585-.625.585-1.601 0-2.187zm-8.047 5.82a1.23 1.23 0 0 0-.312.586L11 20.719c-.04.234 0 .468.156.625s.39.195.586.156l2.383-.586a1.6 1.6 0 0 0 .547-.352l4.14-4.101-2.773-2.773z' })));
const ForwardRef = forwardRef(StandalonePenCircleFillIcon);
export default ForwardRef;
