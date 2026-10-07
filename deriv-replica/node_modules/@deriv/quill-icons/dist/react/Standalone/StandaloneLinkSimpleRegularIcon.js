import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLinkSimpleRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 16.5A6.243 6.243 0 0 1 11 10.25h3.125c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H11c-2.773 0-5 2.266-5 5 0 2.773 2.227 5 5 5h3.125c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H11a6.22 6.22 0 0 1-6.25-6.25m22.5 0A6.243 6.243 0 0 1 21 22.75h-3.125a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H21c2.734 0 5-2.227 5-5 0-2.734-2.266-5-5-5h-3.125a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H21c3.438 0 6.25 2.813 6.25 6.25m-16.562-.625h10.625c.312 0 .625.313.625.625a.64.64 0 0 1-.625.625H10.688a.617.617 0 0 1-.626-.625c0-.312.274-.625.626-.625' })));
const ForwardRef = forwardRef(StandaloneLinkSimpleRegularIcon);
export default ForwardRef;
