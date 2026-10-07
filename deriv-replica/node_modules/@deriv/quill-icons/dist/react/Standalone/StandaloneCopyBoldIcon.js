import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCopyBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 19.625a.64.64 0 0 0 .625-.625v-7.969l-2.656-2.656H14.75a.64.64 0 0 0-.625.625v10c0 .352.273.625.625.625zm-7.5 1.875a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h5.469c.468 0 .976.234 1.328.586l2.617 2.617c.352.352.586.86.586 1.328V19c0 1.406-1.133 2.5-2.5 2.5zm-5-10H11v1.875H9.75a.64.64 0 0 0-.625.625v10c0 .352.273.625.625.625h7.5a.64.64 0 0 0 .625-.625v-1.25h1.875V24c0 1.406-1.133 2.5-2.5 2.5h-7.5a2.47 2.47 0 0 1-2.5-2.5V14c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneCopyBoldIcon);
export default ForwardRef;
