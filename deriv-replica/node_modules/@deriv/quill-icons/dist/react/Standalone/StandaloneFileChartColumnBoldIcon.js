import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileChartColumnBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.375 24c0 .352.273.625.625.625h10a.64.64 0 0 0 .625-.625V12.75H18.5c-.703 0-1.25-.547-1.25-1.25V8.375H11a.64.64 0 0 0-.625.625zM11 6.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m5.938 10.938v5c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937v-5c0-.508.39-.938.937-.938a.95.95 0 0 1 .938.938m3.437 1.25v3.75c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-3.75c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938m-6.875 1.25v2.5c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-2.5c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938' })));
const ForwardRef = forwardRef(StandaloneFileChartColumnBoldIcon);
export default ForwardRef;
