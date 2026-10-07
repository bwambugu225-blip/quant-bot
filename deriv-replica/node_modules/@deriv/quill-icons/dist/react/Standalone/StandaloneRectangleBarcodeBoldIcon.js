import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRectangleBarcodeBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9.625a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h17.5a.64.64 0 0 0 .625-.625v-12.5c0-.312-.312-.625-.625-.625zm-2.5.625c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5zm4.688 1.25a.95.95 0 0 1 .937.938v8.124c0 .547-.43.938-.937.938-.547 0-.938-.39-.938-.937v-8.125c0-.508.39-.938.938-.938m2.812 0c.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-8.75c0-.312.273-.625.625-.625m1.875.938c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v8.124c0 .547-.43.938-.937.938-.547 0-.938-.39-.938-.937zm5.313-.938a.95.95 0 0 1 .937.938v8.124c0 .547-.43.938-.937.938-.547 0-.938-.39-.938-.937v-8.125c0-.508.39-.938.938-.938m2.812.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v8.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625z' })));
const ForwardRef = forwardRef(StandaloneRectangleBarcodeBoldIcon);
export default ForwardRef;
