import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLightbulbFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.625 21.5h-6.25c-.39-1.21-1.172-2.305-1.953-3.36l-.586-.82c-.781-1.133-1.211-2.46-1.211-3.945A6.86 6.86 0 0 1 16.5 6.5c3.79 0 6.875 3.086 6.875 6.914 0 1.445-.469 2.774-1.25 3.906l-.586.82c-.781 1.055-1.562 2.15-1.914 3.36m-3.125 5c-1.758 0-3.125-1.367-3.125-3.125v-.625h6.25v.625A3.11 3.11 0 0 1 16.5 26.5m-3.125-13.125A3.11 3.11 0 0 1 16.5 10.25a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625-2.422 0-4.375 1.992-4.375 4.375 0 .352.273.625.625.625a.64.64 0 0 0 .625-.625' })));
const ForwardRef = forwardRef(StandaloneLightbulbFillIcon);
export default ForwardRef;
