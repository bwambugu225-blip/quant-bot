import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPlus1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M8.5 2.5a.5.5 0 0 0-1 0v5h-5a.5.5 0 0 0 0 1h5v5a.5.5 0 0 0 1 0v-5h5a.5.5 0 0 0 0-1h-5z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyPlus1pxIcon);
export default ForwardRef;
