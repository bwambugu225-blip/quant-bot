import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileCircleInfoFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 9c0-1.367 1.094-2.5 2.5-2.5h6.25v5c0 .703.547 1.25 1.25 1.25h5v1.523c-2.89.82-5 3.477-5 6.602a6.92 6.92 0 0 0 2.852 5.625H7.25a2.47 2.47 0 0 1-2.5-2.5zm15 2.5h-5v-5zm1.875 3.75c1.992 0 3.828 1.094 4.844 2.813 1.015 1.757 1.015 3.906 0 5.625a5.58 5.58 0 0 1-4.844 2.812 5.6 5.6 0 0 1-4.883-2.812c-1.015-1.72-1.015-3.868 0-5.625 1.016-1.72 2.852-2.813 4.883-2.813m0 3.75c.508 0 .938-.39.938-.937a.95.95 0 0 0-.938-.938.925.925 0 0 0-.937.938c0 .546.39.937.937.937m-1.25 1.875c0 .352.273.625.625.625v1.875a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h1.25a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625v-2.5c0-.312-.312-.625-.625-.625H21a.64.64 0 0 0-.625.625' })));
const ForwardRef = forwardRef(StandaloneFileCircleInfoFillIcon);
export default ForwardRef;
