import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendDownRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.523 25.836a.64.64 0 0 1-.859-.273l-3.555-7.188H17.25c-.273 0-.469-.117-.586-.312l-4.727-9.454-6.914 3.477c-.312.156-.703 0-.859-.274a.64.64 0 0 1 .274-.859l7.5-3.75a.64.64 0 0 1 .859.274l4.805 9.648H23.5c.234 0 .43.156.547.352l3.75 7.5a.64.64 0 0 1-.274.859' })));
const ForwardRef = forwardRef(StandaloneChartTrendDownRegularIcon);
export default ForwardRef;
