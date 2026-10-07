import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBackwardStepRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.25 9.625v5.313l6.953-5.665c.195-.156.43-.273.703-.273.586 0 1.094.508 1.094 1.094v12.851c0 .586-.508 1.055-1.094 1.055a1.1 1.1 0 0 1-.703-.234l-6.953-5.664v5.273a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625m7.5.82L12.29 16.5l7.46 6.094z' })));
const ForwardRef = forwardRef(StandaloneBackwardStepRegularIcon);
export default ForwardRef;
