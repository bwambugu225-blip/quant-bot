import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneAndroidIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.156 18.297c.508 0 .938-.39.938-.938a.95.95 0 0 0-.938-.937.95.95 0 0 0-.937.937c0 .547.43.938.937.938m-10.351 0c.508 0 .937-.39.937-.938a.95.95 0 0 0-.937-.937.95.95 0 0 0-.938.937c0 .547.43.938.938.938m10.703-5.625c3.203 1.758 5.39 5 5.742 8.828H4.75c.313-3.828 2.5-7.07 5.703-8.828L8.578 9.43a.36.36 0 0 1 0-.39q.117-.235.352-.235c.156 0 .273.117.351.234l1.875 3.281a11.86 11.86 0 0 1 9.649 0l1.875-3.28c.078-.118.195-.235.351-.235q.235 0 .352.234a.36.36 0 0 1 0 .39z' })));
const ForwardRef = forwardRef(StandaloneAndroidIcon);
export default ForwardRef;
