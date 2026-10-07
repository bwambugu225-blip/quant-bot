import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSterlingSignRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 12.438V16.5h6.25c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-6.29A15.6 15.6 0 0 1 11.392 24h10.234c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-11.25a.68.68 0 0 1-.547-.273.6.6 0 0 1 0-.625l.04-.079a14 14 0 0 0 1.718-6.523h-1.211a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h1.25v-4.062a4.676 4.676 0 0 1 4.688-4.688h.273c.508 0 .977.117 1.484.273l3.125 1.016c.313.117.47.469.39.82-.116.313-.468.47-.82.391l-3.124-1.055A3.2 3.2 0 0 0 16.586 9h-.273a3.443 3.443 0 0 0-3.438 3.438' })));
const ForwardRef = forwardRef(StandaloneSterlingSignRegularIcon);
export default ForwardRef;
