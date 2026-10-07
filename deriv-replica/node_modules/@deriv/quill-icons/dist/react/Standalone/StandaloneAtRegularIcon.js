import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneAtRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 7.75c-4.844 0-8.75 3.945-8.75 8.75A8.736 8.736 0 0 0 16 25.25c.313 0 .625.313.625.625A.64.64 0 0 1 16 26.5a9.97 9.97 0 0 1-10-10c0-5.508 4.453-10 10-10 5.508 0 10 4.492 10 10v.938a3.443 3.443 0 0 1-3.437 3.437c-1.329 0-2.461-.703-3.047-1.797A4.31 4.31 0 0 1 16 20.875a4.37 4.37 0 0 1-4.375-4.375c0-2.383 1.953-4.375 4.375-4.375 1.21 0 2.305.508 3.125 1.328v-.078c0-.312.273-.625.625-.625.313 0 .625.313.625.625v4.063c0 1.21.977 2.187 2.188 2.187 1.171 0 2.187-.977 2.187-2.187V16.5c0-4.805-3.945-8.75-8.75-8.75m3.125 8.75c0-1.094-.625-2.11-1.562-2.695-.977-.547-2.188-.547-3.125 0-.977.586-1.563 1.601-1.563 2.695 0 1.133.586 2.148 1.563 2.734.937.547 2.148.547 3.124 0 .938-.586 1.563-1.601 1.563-2.734' })));
const ForwardRef = forwardRef(StandaloneAtRegularIcon);
export default ForwardRef;
