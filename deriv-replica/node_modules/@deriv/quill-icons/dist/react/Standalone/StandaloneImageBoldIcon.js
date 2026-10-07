import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneImageBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 9.625h-15a.64.64 0 0 0-.625.625v12.54l.156-.235 3.125-4.375c.196-.274.469-.43.781-.43.274 0 .586.156.743.39l1.21 1.68 3.243-4.18a.89.89 0 0 1 .742-.39c.273 0 .547.156.742.39l5.313 6.876.195.234v-12.5c0-.312-.312-.625-.625-.625M8.5 7.75h15c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5m3.125 7.5a1.87 1.87 0 0 1-1.64-.937c-.352-.547-.352-1.29 0-1.876.35-.546.937-.937 1.64-.937.664 0 1.25.39 1.602.938.351.585.351 1.328 0 1.874-.352.586-.938.938-1.602.938' })));
const ForwardRef = forwardRef(StandaloneImageBoldIcon);
export default ForwardRef;
