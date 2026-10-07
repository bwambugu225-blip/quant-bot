import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileArrowDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 6.5h6.25v5c0 .703.547 1.25 1.25 1.25h5V24c0 1.406-1.133 2.5-2.5 2.5H11A2.47 2.47 0 0 1 8.5 24V9c0-1.367 1.094-2.5 2.5-2.5m7.5 0 5 5h-5zm-1.562 9.063h-.04a.925.925 0 0 0-.937-.938.95.95 0 0 0-.938.938v4.023l-1.21-1.211a.856.856 0 0 0-1.29 0 .856.856 0 0 0 0 1.29l2.813 2.812c.351.39.937.39 1.289 0l2.813-2.813a.856.856 0 0 0 0-1.289.856.856 0 0 0-1.29 0l-1.21 1.21z' })));
const ForwardRef = forwardRef(StandaloneFileArrowDownFillIcon);
export default ForwardRef;
