import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWalletCirclePlusFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 10.25c0-1.367 1.094-2.5 2.5-2.5h15c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H6.625a.64.64 0 0 0-.625.625c0 .352.273.625.625.625H21c1.367 0 2.5 1.133 2.5 2.5v.04c-.234 0-.43-.04-.625-.04A6.86 6.86 0 0 0 16 20.875c0 1.68.586 3.203 1.563 4.375H6a2.47 2.47 0 0 1-2.5-2.5zm13.75 10.625c0-3.086 2.5-5.625 5.625-5.625 3.086 0 5.625 2.54 5.625 5.625a5.626 5.626 0 0 1-5.625 5.625 5.6 5.6 0 0 1-5.625-5.625m2.5 0c0 .352.273.625.625.625h1.875v1.875c0 .352.273.625.625.625a.64.64 0 0 0 .625-.625V21.5h1.875a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625H23.5v-1.875c0-.312-.312-.625-.625-.625a.64.64 0 0 0-.625.625v1.875h-1.875a.64.64 0 0 0-.625.625' })));
const ForwardRef = forwardRef(StandaloneWalletCirclePlusFillIcon);
export default ForwardRef;
