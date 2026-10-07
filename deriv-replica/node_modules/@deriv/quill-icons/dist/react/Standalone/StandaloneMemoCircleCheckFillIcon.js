import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMemoCircleCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 9c0-1.367 1.094-2.5 2.5-2.5h10c1.367 0 2.5 1.133 2.5 2.5v5.273c-2.89.82-5 3.477-5 6.602a6.92 6.92 0 0 0 2.852 5.625H7.25a2.47 2.47 0 0 1-2.5-2.5zm2.5 3.125c0 .352.273.625.625.625h8.75a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-8.75a.64.64 0 0 0-.625.625m.625 3.125a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h6.25a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625zm0 3.75a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h3.75a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625zM16 20.875a5.58 5.58 0 0 1 2.813-4.844c1.718-1.015 3.867-1.015 5.625 0 1.718 1.016 2.812 2.852 2.812 4.844 0 2.031-1.094 3.867-2.812 4.883-1.758 1.015-3.907 1.015-5.625 0A5.6 5.6 0 0 1 16 20.875m7.344-1.68L21 21.578l-1.133-1.133a.66.66 0 0 0-.898 0 .66.66 0 0 0 0 .899l1.562 1.562a.66.66 0 0 0 .899 0l2.812-2.812a.66.66 0 0 0 0-.899.66.66 0 0 0-.898 0' })));
const ForwardRef = forwardRef(StandaloneMemoCircleCheckFillIcon);
export default ForwardRef;
