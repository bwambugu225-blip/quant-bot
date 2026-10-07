import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.797 6.656c.625.313.86 1.055.547 1.68l-3.75 7.5c-.196.43-.625.664-1.094.664h-5.508l-4.648 9.336a1.24 1.24 0 0 1-1.68.547l-7.5-3.75a1.24 1.24 0 0 1-.547-1.68 1.24 1.24 0 0 1 1.68-.547l6.367 3.203 4.453-8.906c.195-.43.625-.703 1.133-.703h5.469l3.398-6.797a1.24 1.24 0 0 1 1.68-.547' })));
const ForwardRef = forwardRef(StandaloneChartTrendUpFillIcon);
export default ForwardRef;
