import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLockBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.875 11.5V14h6.25v-2.5A3.134 3.134 0 0 0 16 8.375a3.11 3.11 0 0 0-3.125 3.125M11 14v-2.5c0-2.734 2.227-5 5-5 2.734 0 5 2.266 5 5V14h1.25c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5v-7.5c0-1.367 1.094-2.5 2.5-2.5zm-1.875 2.5V24c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625v-7.5c0-.312-.312-.625-.625-.625H9.75a.64.64 0 0 0-.625.625' })));
const ForwardRef = forwardRef(StandaloneLockBoldIcon);
export default ForwardRef;
