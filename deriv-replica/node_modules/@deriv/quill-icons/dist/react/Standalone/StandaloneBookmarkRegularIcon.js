import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBookmarkRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 8.375c0-1.016.82-1.875 1.875-1.875h11.25c1.016 0 1.875.86 1.875 1.875v17.266c0 .507-.39.859-.898.859a1.04 1.04 0 0 1-.47-.117L16 22.28l-6.172 4.102a1.04 1.04 0 0 1-.469.117c-.507 0-.859-.352-.859-.86zm1.875-.625a.64.64 0 0 0-.625.625v16.563l5.898-3.946a.67.67 0 0 1 .665 0l5.937 3.945V8.375c0-.312-.312-.625-.625-.625z' })));
const ForwardRef = forwardRef(StandaloneBookmarkRegularIcon);
export default ForwardRef;
