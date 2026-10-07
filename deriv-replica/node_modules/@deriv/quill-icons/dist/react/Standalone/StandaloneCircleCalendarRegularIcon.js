import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCalendarRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m8.125-6.25c.313 0 .625.313.625.625v.625h2.5v-.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v.625h.625c1.016 0 1.875.86 1.875 1.875v6.25c0 1.055-.86 1.875-1.875 1.875h-6.25A1.85 1.85 0 0 1 11 19.625v-6.25c0-1.016.82-1.875 1.875-1.875h.625v-.625c0-.312.273-.625.625-.625m-1.875 3.125V14h7.5v-.625c0-.312-.312-.625-.625-.625h-6.25a.64.64 0 0 0-.625.625m7.5 1.875h-7.5v4.375c0 .352.273.625.625.625h6.25a.64.64 0 0 0 .625-.625z' })));
const ForwardRef = forwardRef(StandaloneCircleCalendarRegularIcon);
export default ForwardRef;
