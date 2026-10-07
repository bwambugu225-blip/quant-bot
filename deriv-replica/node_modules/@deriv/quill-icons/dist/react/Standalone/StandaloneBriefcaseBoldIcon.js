import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBriefcaseBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 8.688v1.562h6.25V8.688a.336.336 0 0 0-.312-.313h-5.625a.31.31 0 0 0-.313.313M11 10.25V8.688c0-1.172.977-2.188 2.188-2.188h5.624C19.985 6.5 21 7.516 21 8.688v1.562h2.5c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-10c0-1.367 1.094-2.5 2.5-2.5zm-3.125 8.125v4.375c0 .352.273.625.625.625h15a.64.64 0 0 0 .625-.625v-4.375H18.5V19c0 .703-.586 1.25-1.25 1.25h-2.5c-.703 0-1.25-.547-1.25-1.25v-.625zM13.5 16.5h10.625v-3.75c0-.312-.312-.625-.625-.625h-15a.64.64 0 0 0-.625.625v3.75z' })));
const ForwardRef = forwardRef(StandaloneBriefcaseBoldIcon);
export default ForwardRef;
