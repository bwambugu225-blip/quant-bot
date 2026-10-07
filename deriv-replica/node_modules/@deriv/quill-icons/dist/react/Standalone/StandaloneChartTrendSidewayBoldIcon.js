import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartTrendSidewayBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.813 16.5c0-.508.39-.937.937-.937h22.5a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938H4.75c-.547 0-.937-.391-.937-.938' })));
const ForwardRef = forwardRef(StandaloneChartTrendSidewayBoldIcon);
export default ForwardRef;
