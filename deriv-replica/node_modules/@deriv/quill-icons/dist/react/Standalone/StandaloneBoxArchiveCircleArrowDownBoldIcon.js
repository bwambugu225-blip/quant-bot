import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBoxArchiveCircleArrowDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 9c0-.664.547-1.25 1.25-1.25h17.5c.664 0 1.25.586 1.25 1.25v3.125c0 .703-.586 1.25-1.25 1.25H4.75c-.703 0-1.25-.547-1.25-1.25zm1.25 5.625h1.875v8.125c0 .352.273.625.625.625h9.219c.234.703.625 1.328 1.093 1.875H7.25a2.47 2.47 0 0 1-2.5-2.5zm.625-5V11.5h16.25V9.625zm4.375 6.563c0-.508.39-.938.938-.938h5.624a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-5.625c-.547 0-.938-.39-.938-.937m7.5 4.687c0-1.992 1.055-3.867 2.813-4.844 1.718-1.015 3.867-1.015 5.625 0a5.61 5.61 0 0 1 2.812 4.844c0 2.031-1.094 3.867-2.812 4.883-1.758 1.015-3.907 1.015-5.625 0a5.6 5.6 0 0 1-2.813-4.883m2.969-.117a.66.66 0 0 0 0 .898 58 58 0 0 1 2.187 2.188.66.66 0 0 0 .899 0c.742-.742 1.445-1.485 2.187-2.188a.66.66 0 0 0 0-.898.66.66 0 0 0-.898 0c-.352.39-.742.742-1.094 1.133v-3.516c0-.312-.312-.625-.625-.625a.64.64 0 0 0-.625.625v3.516c-.39-.391-.781-.743-1.133-1.133a.66.66 0 0 0-.898 0' })));
const ForwardRef = forwardRef(StandaloneBoxArchiveCircleArrowDownBoldIcon);
export default ForwardRef;
