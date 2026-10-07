import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMinusBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0 .547-.43.938-.937.938H8.813c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937h14.375a.95.95 0 0 1 .937.937' })));
const ForwardRef = forwardRef(StandaloneMinusBoldIcon);
export default ForwardRef;
