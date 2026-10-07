import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWindowMinimizeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6.625 24h18.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H6.625A.617.617 0 0 1 6 24.625c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneWindowMinimizeRegularIcon);
export default ForwardRef;
