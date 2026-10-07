import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneComputerRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 9H6c-.703 0-1.25.586-1.25 1.25V19c0 .703.547 1.25 1.25 1.25h12.5c.664 0 1.25-.547 1.25-1.25v-8.75c0-.664-.586-1.25-1.25-1.25M6 21.5A2.47 2.47 0 0 1 3.5 19v-8.75c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5V19c0 1.406-1.133 2.5-2.5 2.5h-3.828l.82 2.5h2.383c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H6.625A.617.617 0 0 1 6 24.625c0-.312.273-.625.625-.625h2.344l.82-2.5zm4.297 2.5h3.867l-.82-2.5h-2.227zM24.125 9a.64.64 0 0 0-.625.625V11.5h3.75V9.625c0-.312-.312-.625-.625-.625zm-.625 3.75V14h3.75v-1.25zm0 10.625c0 .352.273.625.625.625h2.5a.64.64 0 0 0 .625-.625V15.25H23.5zm-1.25-13.75c0-1.016.82-1.875 1.875-1.875h2.5c1.016 0 1.875.86 1.875 1.875v13.75c0 1.055-.86 1.875-1.875 1.875h-2.5a1.85 1.85 0 0 1-1.875-1.875zm3.125 10.938c-.547 0-.937-.391-.937-.938 0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937c0 .547-.43.938-.938.938' })));
const ForwardRef = forwardRef(StandaloneComputerRegularIcon);
export default ForwardRef;
