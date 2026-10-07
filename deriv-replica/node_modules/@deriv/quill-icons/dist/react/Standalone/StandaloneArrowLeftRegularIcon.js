import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowLeftRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm7.406 16.07 6.875-6.875a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-5.82 5.781h14.765c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H9.359l5.82 5.82a.66.66 0 0 1 0 .899.66.66 0 0 1-.898 0l-6.875-6.875a.66.66 0 0 1 0-.899' })));
const ForwardRef = forwardRef(StandaloneArrowLeftRegularIcon);
export default ForwardRef;
