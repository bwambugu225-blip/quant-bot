import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneScissorsFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16 14 5.469-5.469c1.133-1.133 2.89-1.133 4.023 0a.684.684 0 0 1 0 .977L14.438 20.563c.195.507.312 1.015.312 1.562 0 2.422-1.992 4.375-4.375 4.375A4.37 4.37 0 0 1 6 22.125c0-2.383 1.953-4.375 4.375-4.375.547 0 1.055.117 1.563.313L13.5 16.5l-1.562-1.523a4.3 4.3 0 0 1-1.563.273A4.37 4.37 0 0 1 6 10.875C6 8.492 7.953 6.5 10.375 6.5c2.383 0 4.375 1.992 4.375 4.375 0 .586-.117 1.094-.312 1.602zm.86 5.898 2.5-2.5 6.132 6.133a.684.684 0 0 1 0 .977c-1.133 1.133-2.89 1.133-4.023 0zM8.5 10.875c0 .703.352 1.29.938 1.64.546.352 1.289.352 1.874 0 .547-.35.938-.937.938-1.64 0-.664-.39-1.25-.937-1.602-.586-.351-1.329-.351-1.876 0-.585.352-.937.938-.937 1.602m1.875 9.375c-.703 0-1.29.39-1.64.938-.352.585-.352 1.328 0 1.875a1.87 1.87 0 0 0 1.64.937c.664 0 1.25-.352 1.602-.937.351-.547.351-1.29 0-1.875-.352-.547-.938-.938-1.602-.938' })));
const ForwardRef = forwardRef(StandaloneScissorsFillIcon);
export default ForwardRef;
