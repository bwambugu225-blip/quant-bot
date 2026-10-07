import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSevenBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.75 8.688c0-.508.39-.938.938-.938h10.625c.312 0 .625.195.78.508.196.273.196.625 0 .937L12.72 24.82a.94.94 0 0 1-1.29.313c-.429-.274-.585-.86-.312-1.29l8.516-14.218h-8.945c-.547 0-.938-.39-.938-.937' })));
const ForwardRef = forwardRef(StandaloneSevenBoldIcon);
export default ForwardRef;
