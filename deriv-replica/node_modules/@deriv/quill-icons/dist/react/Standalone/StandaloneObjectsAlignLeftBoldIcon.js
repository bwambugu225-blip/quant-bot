import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneObjectsAlignLeftBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 7.438c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v18.125c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937zm6.875 5.937h11.25v-2.5h-11.25zM11 10.875C11 9.859 11.82 9 12.875 9h11.25C25.141 9 26 9.86 26 10.875v2.5c0 1.055-.86 1.875-1.875 1.875h-11.25A1.85 1.85 0 0 1 11 13.375zm1.875 11.25h6.25v-2.5h-6.25zM11 19.625c0-1.016.82-1.875 1.875-1.875h6.25c1.016 0 1.875.86 1.875 1.875v2.5C21 23.18 20.14 24 19.125 24h-6.25A1.85 1.85 0 0 1 11 22.125z' })));
const ForwardRef = forwardRef(StandaloneObjectsAlignLeftBoldIcon);
export default ForwardRef;
