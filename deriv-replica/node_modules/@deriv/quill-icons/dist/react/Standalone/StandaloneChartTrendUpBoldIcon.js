import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendUpBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.64 6.93a.925.925 0 0 1 .43 1.25l-3.75 7.5c-.156.312-.468.508-.86.508h-5.663L13.07 25.68a.925.925 0 0 1-1.25.43l-7.5-3.75a.925.925 0 0 1-.43-1.25.925.925 0 0 1 1.25-.43L11.82 24l4.57-9.14a.96.96 0 0 1 .86-.547h5.664l3.477-6.954a.925.925 0 0 1 1.25-.43' })));
const ForwardRef = forwardRef(StandaloneChartTrendUpBoldIcon);
export default ForwardRef;
