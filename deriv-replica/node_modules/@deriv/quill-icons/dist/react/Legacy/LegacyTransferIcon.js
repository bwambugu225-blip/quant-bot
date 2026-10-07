import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyTransferIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 10.293 14.793 6.5 11 2.707V4.5a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H10V1.5a.5.5 0 0 1 .854-.354l5 5a.5.5 0 0 1 0 .708l-5 5A.498.498 0 0 1 10 11.5V8H5.5a.5.5 0 0 1-.5-.5V5.707L1.207 9.5 5 13.293V11.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1H6v2.5a.5.5 0 0 1-.854.354l-5-5a.5.5 0 0 1 0-.708l5-5A.5.5 0 0 1 6 4.5V7h4.5a.5.5 0 0 1 .5.5z' })));
const ForwardRef = forwardRef(LegacyTransferIcon);
export default ForwardRef;
