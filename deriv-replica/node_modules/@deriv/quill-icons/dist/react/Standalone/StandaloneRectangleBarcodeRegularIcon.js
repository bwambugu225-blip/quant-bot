import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRectangleBarcodeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9C6.547 9 6 9.586 6 10.25v12.5c0 .703.547 1.25 1.25 1.25h17.5c.664 0 1.25-.547 1.25-1.25v-12.5C26 9.586 25.414 9 24.75 9zm-2.5 1.25c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5zm3.75 1.875c0-.312.273-.625.625-.625.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm11.25 0c0-.312.273-.625.625-.625.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm3.125-.625c.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-8.75c0-.312.273-.625.625-.625M11 12.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625zm3.125-.625c.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-8.75c0-.312.273-.625.625-.625m2.5.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625z' })));
const ForwardRef = forwardRef(StandaloneRectangleBarcodeRegularIcon);
export default ForwardRef;
