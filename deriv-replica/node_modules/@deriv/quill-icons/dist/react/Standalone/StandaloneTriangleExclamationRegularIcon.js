import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTriangleExclamationRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.328 22.945c-.078.117-.078.235-.078.352 0 .39.313.742.703.742h16.055c.39 0 .742-.352.742-.742a.63.63 0 0 0-.117-.352L16.78 9.47A.94.94 0 0 0 16 9a.95.95 0 0 0-.82.469zm-1.094-.625 7.852-13.476A2.25 2.25 0 0 1 16 7.75c.742 0 1.484.43 1.875 1.094l7.852 13.476c.156.274.273.625.273.977 0 1.094-.898 1.953-1.992 1.953H7.953A1.934 1.934 0 0 1 6 23.297c0-.352.078-.703.234-.977M16 12.75c.313 0 .625.313.625.625v5A.64.64 0 0 1 16 19a.617.617 0 0 1-.625-.625v-5c0-.312.273-.625.625-.625m-.937 8.75c0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938-.547 0-.937-.391-.937-.938' })));
const ForwardRef = forwardRef(StandaloneTriangleExclamationRegularIcon);
export default ForwardRef;
