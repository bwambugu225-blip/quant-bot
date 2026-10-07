import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCut1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M4.5 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2 4.5a2.5 2.5 0 1 1 4.586 1.379L8 7.293 13.293 2H14v.707L8.707 8 14 13.293V14h-.707L8 8.707l-1.414 1.414a2.5 2.5 0 1 1-.707-.707L7.293 8 5.879 6.586A2.5 2.5 0 0 1 2 4.5M4.5 10a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyCut1pxIcon);
export default ForwardRef;
