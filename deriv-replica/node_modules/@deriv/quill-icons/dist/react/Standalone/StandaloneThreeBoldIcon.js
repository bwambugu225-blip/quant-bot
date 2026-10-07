import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneThreeBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 8.688c0-.508.39-.938.938-.938h10c.351 0 .703.234.859.625.156.352.039.742-.235 1.016l-5.82 5.547h1.602c2.812 0 5.156 2.343 5.156 5.156 0 2.851-2.344 5.156-5.156 5.156h-3.555c-1.523 0-2.93-.86-3.633-2.227l-.078-.156a.925.925 0 0 1 .43-1.25.925.925 0 0 1 1.25.43l.078.117c.351.742 1.133 1.211 1.953 1.211h3.555a3.276 3.276 0 0 0 3.281-3.281 3.3 3.3 0 0 0-3.281-3.282h-3.907a.99.99 0 0 1-.898-.585.98.98 0 0 1 .234-1.016l5.82-5.586h-7.655c-.547 0-.938-.39-.938-.937' })));
const ForwardRef = forwardRef(StandaloneThreeBoldIcon);
export default ForwardRef;
