import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileDocFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 9c0-1.367 1.094-2.5 2.5-2.5h6.25v5c0 .703.547 1.25 1.25 1.25h5v5.625h-8.125a2.49 2.49 0 0 0-2.5 2.5V26.5H8.5A2.47 2.47 0 0 1 6 24zm15 2.5h-5v-5zm-8.125 8.75h1.25c1.016 0 1.875.86 1.875 1.875v2.5c0 1.055-.86 1.875-1.875 1.875h-1.25a.617.617 0 0 1-.625-.625v-5c0-.312.273-.625.625-.625m.625 5h.625a.64.64 0 0 0 .625-.625v-2.5c0-.312-.312-.625-.625-.625H13.5zm10.313-5h.625c.859 0 1.562.703 1.562 1.563v.312a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-.312a.336.336 0 0 0-.312-.313h-.625a.31.31 0 0 0-.313.313v3.125c0 .195.117.312.313.312h.625a.31.31 0 0 0 .312-.312v-.313c0-.312.273-.625.625-.625.313 0 .625.313.625.625v.313c0 .898-.703 1.562-1.562 1.562h-.625c-.899 0-1.563-.664-1.563-1.562v-3.125c0-.86.664-1.563 1.563-1.563m-6.563 1.563c0-.86.664-1.563 1.563-1.563h.625c.859 0 1.562.703 1.562 1.563v3.125c0 .898-.703 1.562-1.562 1.562h-.625c-.899 0-1.563-.664-1.563-1.562zm1.563-.313a.31.31 0 0 0-.313.313v3.125c0 .195.117.312.313.312h.625a.31.31 0 0 0 .312-.312v-3.125a.336.336 0 0 0-.312-.313z' })));
const ForwardRef = forwardRef(StandaloneFileDocFillIcon);
export default ForwardRef;
