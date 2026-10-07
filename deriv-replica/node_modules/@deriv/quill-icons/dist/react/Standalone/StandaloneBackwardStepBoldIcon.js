import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBackwardStepBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 9.938v4.14l6.875-4.844A1.06 1.06 0 0 1 20.414 9c.664 0 1.211.547 1.211 1.21v12.618c0 .664-.547 1.172-1.172 1.172-.273 0-.508-.04-.703-.195l-6.875-4.844v4.102c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937V9.937c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938m0 6.757L19.75 21.5v-9.96l-6.875 4.804z' })));
const ForwardRef = forwardRef(StandaloneBackwardStepBoldIcon);
export default ForwardRef;
