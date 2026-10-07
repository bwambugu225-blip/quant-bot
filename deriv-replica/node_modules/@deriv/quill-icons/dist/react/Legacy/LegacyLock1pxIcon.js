import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyLock1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.5 8a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5zM8 1a4 4 0 0 1 4 4v2.086A1.5 1.5 0 0 1 13 8.5v5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 13.5v-5a1.5 1.5 0 0 1 1-1.415V5a4 4 0 0 1 4-4m0 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2m0-8a3 3 0 0 0-3 3v2h6V5a3 3 0 0 0-3-3' })));
const ForwardRef = forwardRef(LegacyLock1pxIcon);
export default ForwardRef;
