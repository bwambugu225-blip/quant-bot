import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.64 26.11a.925.925 0 0 1-1.25-.43l-3.476-6.992H17.25c-.39 0-.703-.196-.86-.508l-4.57-9.14-6.68 3.32a.925.925 0 0 1-1.25-.43.925.925 0 0 1 .43-1.25l7.5-3.75a.925.925 0 0 1 1.25.43l4.727 9.453h5.664a.96.96 0 0 1 .86.546l3.75 7.5a.925.925 0 0 1-.43 1.25' })));
const ForwardRef = forwardRef(StandaloneChartTrendDownBoldIcon);
export default ForwardRef;
