import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowLeftToLineRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 23.375V9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v13.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625m3.906-7.305 5-5a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-3.946 3.906h11.016c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H13.11l3.945 3.945a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0l-5-5a.66.66 0 0 1 0-.899' })));
const ForwardRef = forwardRef(StandaloneArrowLeftToLineRegularIcon);
export default ForwardRef;
