import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBoxArchiveCircleArrowDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 9c0-.664.547-1.25 1.25-1.25h17.5c.664 0 1.25.586 1.25 1.25v1.25c0 .703-.586 1.25-1.25 1.25H4.75c-.703 0-1.25-.547-1.25-1.25zm1.25 3.75h17.5v1.29A6.876 6.876 0 0 0 16 20.874c0 1.68.586 3.203 1.563 4.375H7.25a2.47 2.47 0 0 1-2.5-2.5zm5 3.125c0 .352.273.625.625.625h6.25a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-6.25a.64.64 0 0 0-.625.625m7.5 5c0-1.992 1.055-3.867 2.813-4.844 1.718-1.015 3.867-1.015 5.625 0a5.61 5.61 0 0 1 2.812 4.844c0 2.031-1.094 3.867-2.812 4.883-1.758 1.015-3.907 1.015-5.625 0a5.6 5.6 0 0 1-2.813-4.883m2.969-.117a.66.66 0 0 0 0 .898l2.187 2.188a.66.66 0 0 0 .899 0l2.187-2.188a.66.66 0 0 0 0-.898.66.66 0 0 0-.898 0L23.5 21.89v-3.516c0-.312-.312-.625-.625-.625a.64.64 0 0 0-.625.625v3.516l-1.133-1.133a.66.66 0 0 0-.898 0' })));
const ForwardRef = forwardRef(StandaloneBoxArchiveCircleArrowDownFillIcon);
export default ForwardRef;
