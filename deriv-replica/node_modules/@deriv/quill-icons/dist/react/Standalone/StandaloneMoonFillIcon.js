import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMoonFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.21 7.75v.04h.743c.274.038.508.233.547.507a.56.56 0 0 1-.273.664 6.85 6.85 0 0 0-3.516 5.977 6.86 6.86 0 0 0 6.875 6.874c.39 0 .781 0 1.172-.078.273-.039.547.078.664.313.117.273.078.547-.117.742a8.7 8.7 0 0 1-6.094 2.461c-4.805 0-8.711-3.906-8.711-8.75 0-4.805 3.906-8.75 8.71-8.75' })));
const ForwardRef = forwardRef(StandaloneMoonFillIcon);
export default ForwardRef;
