import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneDesktopBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 8.375H7.25A.64.64 0 0 0 6.625 9v7.5h18.75V9c0-.312-.312-.625-.625-.625m2.5 8.125v3.75c0 1.406-1.133 2.5-2.5 2.5h-5.781l.312 1.875h2.032a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H10.688c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h1.992l.312-1.875H7.25a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5zM6.625 18.375v1.875c0 .352.273.625.625.625h17.5a.64.64 0 0 0 .625-.625v-1.875zm7.969 6.25h2.773l-.312-1.875h-2.149z' })));
const ForwardRef = forwardRef(StandaloneDesktopBoldIcon);
export default ForwardRef;
