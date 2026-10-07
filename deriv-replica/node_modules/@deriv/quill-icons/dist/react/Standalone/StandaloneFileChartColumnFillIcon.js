import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileChartColumnFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 6.5h6.25v5c0 .703.547 1.25 1.25 1.25h5V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m7.5 0 5 5h-5zm-1.562 9.688A.95.95 0 0 0 16 15.25a.925.925 0 0 0-.937.938v6.875c0 .546.39.937.937.937.508 0 .938-.39.938-.937zm3.437 2.5a.95.95 0 0 0-.937-.938.925.925 0 0 0-.938.938v4.375c0 .546.39.937.938.937.507 0 .937-.39.937-.937zm-6.875 2.5a.95.95 0 0 0-.937-.938.925.925 0 0 0-.938.938v1.875c0 .546.39.937.938.937.507 0 .937-.39.937-.937z' })));
const ForwardRef = forwardRef(StandaloneFileChartColumnFillIcon);
export default ForwardRef;
