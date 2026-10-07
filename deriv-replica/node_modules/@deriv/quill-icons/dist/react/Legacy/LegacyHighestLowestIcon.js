import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyHighestLowestIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M10.959 8.5a3 3 0 0 1-5.918 0H0v-1h5.041a3 3 0 0 1 5.918 0H16v1z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyHighestLowestIcon);
export default ForwardRef;
