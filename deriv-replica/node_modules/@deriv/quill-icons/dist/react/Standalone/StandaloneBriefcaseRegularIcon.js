import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBriefcaseRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.25 8.375v1.875h7.5V8.375c0-.312-.312-.625-.625-.625h-6.25a.64.64 0 0 0-.625.625M11 10.25V8.375c0-1.016.82-1.875 1.875-1.875h6.25C20.141 6.5 21 7.36 21 8.375v1.875h2.5c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-10c0-1.367 1.094-2.5 2.5-2.5zm9.375 1.25H8.5c-.703 0-1.25.586-1.25 1.25v3.75h17.5v-3.75c0-.664-.586-1.25-1.25-1.25zm4.375 6.25h-5.625v1.875c0 .703-.586 1.25-1.25 1.25h-3.75c-.703 0-1.25-.547-1.25-1.25V17.75H7.25v5c0 .703.547 1.25 1.25 1.25h15c.664 0 1.25-.547 1.25-1.25zm-10.625 0v1.875h3.75V17.75z' })));
const ForwardRef = forwardRef(StandaloneBriefcaseRegularIcon);
export default ForwardRef;
