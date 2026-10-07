import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMobileScreenButtonFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.125 9c0-1.367 1.094-2.5 2.5-2.5h8.75c1.367 0 2.5 1.133 2.5 2.5v15c0 1.406-1.133 2.5-2.5 2.5h-8.75a2.47 2.47 0 0 1-2.5-2.5zm5 15c0 .352.273.625.625.625h2.5a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-2.5a.64.64 0 0 0-.625.625m6.25-15h-8.75v12.5h8.75z' })));
const ForwardRef = forwardRef(StandaloneMobileScreenButtonFillIcon);
export default ForwardRef;
