import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneImageFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 10.25c0-1.367 1.094-2.5 2.5-2.5h15c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5zm12.617 4.18a.89.89 0 0 0-.742-.43c-.312 0-.625.156-.781.43l-3.399 5-1.054-1.328a.95.95 0 0 0-.703-.352.97.97 0 0 0-.743.352l-2.5 3.125c-.234.312-.273.703-.117 1.015.156.313.469.508.86.508h13.124c.313 0 .665-.156.82-.469a.97.97 0 0 0-.077-.976zM10.375 14c.664 0 1.25-.352 1.602-.937.351-.547.351-1.29 0-1.876-.352-.546-.938-.937-1.602-.937-.703 0-1.29.39-1.64.938-.352.585-.352 1.328 0 1.874a1.87 1.87 0 0 0 1.64.938' })));
const ForwardRef = forwardRef(StandaloneImageFillIcon);
export default ForwardRef;
