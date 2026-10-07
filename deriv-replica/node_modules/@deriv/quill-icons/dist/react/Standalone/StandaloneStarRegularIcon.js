import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneStarRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.578 13.102c-.195.39-.547.625-.937.703l-5.352.78 3.867 3.868c.313.274.43.703.352 1.094l-.899 5.469 4.766-2.578c.39-.196.82-.196 1.21 0l4.767 2.578-.899-5.47c-.078-.39.04-.82.352-1.093l3.867-3.867-5.352-.781c-.43-.078-.78-.313-.937-.703L15.96 8.18zm7.735 13.32h.039L16 23.532l-5.352 2.89c-.312.156-.703.117-1.015-.078-.274-.235-.43-.586-.352-.938l1.016-6.054-4.336-4.297a.92.92 0 0 1-.234-.977c.117-.312.39-.586.742-.625l5.976-.898 2.696-5.508c.156-.313.468-.547.82-.547a.96.96 0 0 1 .86.547l2.695 5.508 5.976.898c.352.04.625.313.742.625a.92.92 0 0 1-.234.977l-4.336 4.297 1.016 6.054c.078.352-.078.703-.352.938a1.05 1.05 0 0 1-1.015.078' })));
const ForwardRef = forwardRef(StandaloneStarRegularIcon);
export default ForwardRef;
