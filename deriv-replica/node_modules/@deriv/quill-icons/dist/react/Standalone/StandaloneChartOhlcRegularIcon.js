import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartOhlcRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c.313 0 .625.313.625.625V9H18.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-1.875v13.125A.64.64 0 0 1 16 24a.617.617 0 0 1-.625-.625V21.5H13.5a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h1.875V7.125c0-.312.273-.625.625-.625M24.125 9c.313 0 .625.313.625.625v8.125h1.875c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H24.75v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V12.75h-1.875a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H23.5V9.625c0-.312.273-.625.625-.625m-16.25 5c.313 0 .625.313.625.625v8.125h1.875c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H8.5v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V17.75H5.375a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H7.25v-1.875c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneChartOhlcRegularIcon);
export default ForwardRef;
