import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFiveBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 8.531a.964.964 0 0 1 .938-.781h8.124a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-7.344l-.938 5.313h5.313c2.812 0 5.156 2.343 5.156 5.156 0 2.851-2.344 5.156-5.156 5.156h-3.75c-1.406 0-2.735-.781-3.36-2.07l-.156-.313a.925.925 0 0 1 .43-1.25.925.925 0 0 1 1.25.43l.156.312c.313.625.977 1.016 1.68 1.016h3.75a3.276 3.276 0 0 0 3.281-3.281 3.3 3.3 0 0 0-3.281-3.282h-6.407a1 1 0 0 1-.742-.312 1.12 1.12 0 0 1-.195-.781z' })));
const ForwardRef = forwardRef(StandaloneFiveBoldIcon);
export default ForwardRef;
