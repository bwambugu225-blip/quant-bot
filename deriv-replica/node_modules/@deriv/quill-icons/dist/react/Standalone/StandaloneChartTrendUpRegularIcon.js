import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendUpRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.523 7.203c.313.156.43.547.274.86l-3.75 7.5a.62.62 0 0 1-.547.312h-5.898l-4.805 9.688a.64.64 0 0 1-.86.273l-7.5-3.75a.64.64 0 0 1-.273-.86.64.64 0 0 1 .86-.273l6.914 3.477 4.726-9.453c.117-.196.313-.352.586-.352h5.86l3.554-7.148a.64.64 0 0 1 .86-.274' })));
const ForwardRef = forwardRef(StandaloneChartTrendUpRegularIcon);
export default ForwardRef;
