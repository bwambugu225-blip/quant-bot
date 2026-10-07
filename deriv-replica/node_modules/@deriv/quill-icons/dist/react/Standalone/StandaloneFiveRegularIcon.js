import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFiveRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.625 8.258c.078-.313.313-.508.625-.508h8.125c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-7.656l-1.563 6.25h6.094c2.734 0 5 2.266 5 5 0 2.773-2.266 5-5 5h-4.219c-1.289 0-2.5-.703-3.086-1.875l-.156-.312c-.156-.313 0-.704.274-.86a.64.64 0 0 1 .859.274l.156.351c.39.742 1.133 1.211 1.953 1.211h4.219a3.751 3.751 0 0 0 0-7.5h-6.875a.67.67 0 0 1-.508-.273c-.117-.157-.156-.352-.117-.508z' })));
const ForwardRef = forwardRef(StandaloneFiveRegularIcon);
export default ForwardRef;
