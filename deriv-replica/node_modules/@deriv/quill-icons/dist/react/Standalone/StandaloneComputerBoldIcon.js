import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneComputerBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 9.625H6a.64.64 0 0 0-.625.625V19c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625v-8.75c0-.312-.312-.625-.625-.625M6 21.5A2.47 2.47 0 0 1 3.5 19v-8.75c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5V19c0 1.406-1.133 2.5-2.5 2.5h-3.398l.625 1.875h1.835a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937H6.938c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h1.796L9.36 21.5zm4.727 1.875h3.007L13.11 21.5h-1.757zm13.398-13.75v1.25h2.5v-1.25zm0 3.125V14h2.5v-1.25zm2.5 3.125h-2.5v7.5h2.5zm-4.375-6.25c0-1.016.82-1.875 1.875-1.875h2.5c1.016 0 1.875.86 1.875 1.875v13.75c0 1.055-.86 1.875-1.875 1.875h-2.5a1.85 1.85 0 0 1-1.875-1.875zm3.125 10.938c-.547 0-.937-.391-.937-.938 0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938' })));
const ForwardRef = forwardRef(StandaloneComputerBoldIcon);
export default ForwardRef;
