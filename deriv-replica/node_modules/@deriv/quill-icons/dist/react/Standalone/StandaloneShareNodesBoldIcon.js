import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneShareNodesBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 11.5c0 2.07-1.68 3.75-3.75 3.75-1.133 0-2.148-.469-2.852-1.29l-3.515 1.759c.078.273.117.547.117.781q0 .41-.117.82l3.515 1.72A3.84 3.84 0 0 1 21 17.75a3.751 3.751 0 0 1 0 7.5c-2.07 0-3.75-1.68-3.75-3.75 0-.234 0-.508.078-.781l-3.515-1.758A3.68 3.68 0 0 1 11 20.25a3.751 3.751 0 0 1 0-7.5c1.094 0 2.11.508 2.813 1.29l3.515-1.72c-.078-.273-.078-.547-.078-.82a3.751 3.751 0 0 1 7.5 0M11 18.375c.664 0 1.25-.352 1.602-.937.351-.547.351-1.29 0-1.875-.352-.547-.938-.938-1.602-.938-.703 0-1.29.39-1.64.938-.352.585-.352 1.328 0 1.874a1.87 1.87 0 0 0 1.64.938M22.875 11.5c0-.664-.39-1.25-.937-1.602-.586-.351-1.329-.351-1.875 0-.586.352-.938.938-.938 1.602 0 .703.352 1.29.938 1.64.546.352 1.289.352 1.875 0 .546-.35.937-.937.937-1.64M21 23.375c.664 0 1.25-.352 1.602-.937.351-.547.351-1.29 0-1.875-.352-.547-.938-.938-1.602-.938-.703 0-1.29.39-1.64.938-.352.585-.352 1.328 0 1.875a1.87 1.87 0 0 0 1.64.937' })));
const ForwardRef = forwardRef(StandaloneShareNodesBoldIcon);
export default ForwardRef;
