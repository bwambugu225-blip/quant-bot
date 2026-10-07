import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyMinus1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyMinus1pxIcon);
export default ForwardRef;
