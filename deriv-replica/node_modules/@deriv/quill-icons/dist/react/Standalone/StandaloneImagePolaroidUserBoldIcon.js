import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneImagePolaroidUserBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.125 22.75c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625v-1.875H9.125zM20.297 19h2.578v-8.75c0-.312-.312-.625-.625-.625H9.75a.64.64 0 0 0-.625.625V19h2.578a2.52 2.52 0 0 1 2.422-1.875h3.75c1.133 0 2.11.82 2.422 1.875m4.453-8.75v12.5c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5h12.5c1.367 0 2.5 1.133 2.5 2.5M13.5 13.375c0-.86.469-1.68 1.25-2.148.742-.43 1.719-.43 2.5 0 .742.468 1.25 1.289 1.25 2.148 0 .898-.508 1.719-1.25 2.188-.781.43-1.758.43-2.5 0a2.54 2.54 0 0 1-1.25-2.188' })));
const ForwardRef = forwardRef(StandaloneImagePolaroidUserBoldIcon);
export default ForwardRef;
