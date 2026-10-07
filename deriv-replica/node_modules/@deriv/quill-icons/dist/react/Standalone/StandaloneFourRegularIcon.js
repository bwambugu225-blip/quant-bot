import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFourRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.297 8.688 10.102 19h9.648v-6.875c0-.312.273-.625.625-.625.313 0 .625.313.625.625V19h1.875c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H21v4.375a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-4.336H9.086a.61.61 0 0 1-.508-.312.7.7 0 0 1-.039-.625l5.625-11.25a.64.64 0 0 1 .86-.274c.312.156.43.547.273.86' })));
const ForwardRef = forwardRef(StandaloneFourRegularIcon);
export default ForwardRef;
