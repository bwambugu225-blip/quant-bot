import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowRightToLineRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 9.625v13.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625m-3.945 7.344-5 5a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l3.946-3.945H7.875a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h10.977l-3.946-3.906a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l5 5a.66.66 0 0 1 0 .899' })));
const ForwardRef = forwardRef(StandaloneArrowRightToLineRegularIcon);
export default ForwardRef;
