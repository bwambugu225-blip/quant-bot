import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMemoCircleCheckBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 8.375A.64.64 0 0 0 6.625 9v15c0 .352.273.625.625.625h8.594a6.7 6.7 0 0 0 1.758 1.875H7.25a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h10c1.367 0 2.5 1.133 2.5 2.5v5.273c-.703.196-1.328.47-1.875.86V9c0-.312-.312-.625-.625-.625zM9.438 11.5h5.624a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937H9.436c-.546 0-.937-.39-.937-.937 0-.508.39-.938.938-.938m0 3.75h5.624a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937H9.436c-.546 0-.937-.39-.937-.937 0-.508.39-.938.938-.938m0 3.75h1.874a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937H9.437c-.546 0-.937-.39-.937-.937 0-.508.39-.938.938-.938m17.812 1.875c0 2.031-1.094 3.867-2.812 4.883-1.758 1.015-3.907 1.015-5.625 0A5.6 5.6 0 0 1 16 20.875a5.58 5.58 0 0 1 2.813-4.844c1.718-1.015 3.867-1.015 5.625 0 1.718 1.016 2.812 2.852 2.812 4.844m-3.008-1.68a.66.66 0 0 0-.898 0L21 21.578l-1.133-1.133a.66.66 0 0 0-.898 0 .66.66 0 0 0 0 .899l1.562 1.562a.66.66 0 0 0 .899 0l2.812-2.812a.66.66 0 0 0 0-.899' })));
const ForwardRef = forwardRef(StandaloneMemoCircleCheckBoldIcon);
export default ForwardRef;
