import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMicrosoftIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 7.75h8.36v8.398H7.25zm9.102 0h8.398v8.398h-8.398zM7.25 16.89h8.36v8.36H7.25zm9.102 0h8.398v8.36h-8.398z' })));
const ForwardRef = forwardRef(StandaloneMicrosoftIcon);
export default ForwardRef;
