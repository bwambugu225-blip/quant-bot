import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePresentationScreenRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M5.375 6.5h21.25c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H5.375a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625M6 9h1.25v8.75c0 .703.547 1.25 1.25 1.25h15c.664 0 1.25-.547 1.25-1.25V9H26v8.75c0 1.406-1.133 2.5-2.5 2.5h-6.875v1.64l3.555 3.555a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0L16 23.024l-3.32 3.32a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l3.594-3.554V20.25H8.5a2.47 2.47 0 0 1-2.5-2.5z' })));
const ForwardRef = forwardRef(StandalonePresentationScreenRegularIcon);
export default ForwardRef;
