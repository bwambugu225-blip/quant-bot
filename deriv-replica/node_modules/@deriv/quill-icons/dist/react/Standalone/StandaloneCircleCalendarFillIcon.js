import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCalendarFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-1.875-16.25a.64.64 0 0 0-.625.625v.625h-1.25c-.703 0-1.25.586-1.25 1.25V14h10v-1.25c0-.664-.586-1.25-1.25-1.25H18.5v-.625c0-.312-.312-.625-.625-.625a.64.64 0 0 0-.625.625v.625h-2.5v-.625c0-.312-.312-.625-.625-.625M11 20.25c0 .703.547 1.25 1.25 1.25h7.5c.664 0 1.25-.547 1.25-1.25v-5H11z' })));
const ForwardRef = forwardRef(StandaloneCircleCalendarFillIcon);
export default ForwardRef;
