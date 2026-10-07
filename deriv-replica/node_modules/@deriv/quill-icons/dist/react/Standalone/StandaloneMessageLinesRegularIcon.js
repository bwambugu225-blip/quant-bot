import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMessageLinesRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.5 22.75v1.875l3.828-2.852c.195-.156.469-.273.742-.273h5.43c.664 0 1.25-.547 1.25-1.25V9c0-.664-.586-1.25-1.25-1.25h-15c-.703 0-1.25.586-1.25 1.25v11.25c0 .703.547 1.25 1.25 1.25h3.75c.664 0 1.25.586 1.25 1.25M8.5 6.5h15C24.867 6.5 26 7.633 26 9v11.25c0 1.406-1.133 2.5-2.5 2.5h-5.43l-4.843 3.633c-.196.156-.43.156-.665.078-.195-.117-.312-.313-.312-.586V22.75H8.5a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5m3.125 5.625h8.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-8.75A.617.617 0 0 1 11 12.75c0-.312.273-.625.625-.625m0 3.75h5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-5A.617.617 0 0 1 11 16.5c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneMessageLinesRegularIcon);
export default ForwardRef;
