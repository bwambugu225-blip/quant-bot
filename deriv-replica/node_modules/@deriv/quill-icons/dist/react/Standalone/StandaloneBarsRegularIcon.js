import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBarsRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9.625c0-.312.273-.625.625-.625h16.25c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H7.875a.617.617 0 0 1-.625-.625m0 6.25c0-.312.273-.625.625-.625h16.25c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H7.875a.617.617 0 0 1-.625-.625m17.5 6.25a.64.64 0 0 1-.625.625H7.875a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h16.25c.313 0 .625.313.625.625' })));
const ForwardRef = forwardRef(StandaloneBarsRegularIcon);
export default ForwardRef;
