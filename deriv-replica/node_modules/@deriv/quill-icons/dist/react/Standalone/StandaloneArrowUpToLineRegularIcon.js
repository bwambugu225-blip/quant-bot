import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpToLineRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.125 7.75h13.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H9.125a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625m7.305 3.945 5 5a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0l-3.906-3.946v10.977a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V13.648l-3.945 3.946a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l5-5a.66.66 0 0 1 .899 0' })));
const ForwardRef = forwardRef(StandaloneArrowUpToLineRegularIcon);
export default ForwardRef;
