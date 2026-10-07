import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPlusCircle1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M14 8A6 6 0 1 1 2 8a6 6 0 0 1 12 0m1 0A7 7 0 1 1 1 8a7 7 0 0 1 14 0M7.5 4.5a.5.5 0 0 1 1 0v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyPlusCircle1pxIcon);
export default ForwardRef;
