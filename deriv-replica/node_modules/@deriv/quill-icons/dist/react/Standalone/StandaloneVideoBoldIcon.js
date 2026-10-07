import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneVideoBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 10.875a.64.64 0 0 0-.625.625v10c0 .352.273.625.625.625h10a.64.64 0 0 0 .625-.625v-10c0-.312-.312-.625-.625-.625zm-2.5.625c0-1.367 1.094-2.5 2.5-2.5h10c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-10a2.47 2.47 0 0 1-2.5-2.5zm20.625 9.219V12.32L21 14.273v-2.03l4.063-1.837c.195-.078.39-.156.625-.156.859 0 1.562.703 1.562 1.563v9.414c0 .859-.703 1.523-1.562 1.523-.235 0-.43-.04-.625-.117L21 20.797v-2.07z' })));
const ForwardRef = forwardRef(StandaloneVideoBoldIcon);
export default ForwardRef;
