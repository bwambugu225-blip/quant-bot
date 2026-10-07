import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneVideoFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 11.5c0-1.367 1.094-2.5 2.5-2.5h10c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-10a2.47 2.47 0 0 1-2.5-2.5zm21.836-1.094c.39.235.664.664.664 1.094v10c0 .469-.273.898-.664 1.133-.43.195-.898.195-1.29-.078l-3.75-2.5-.546-.352v-6.367l.547-.352 3.75-2.5c.39-.273.86-.273 1.289-.078' })));
const ForwardRef = forwardRef(StandaloneVideoFillIcon);
export default ForwardRef;
