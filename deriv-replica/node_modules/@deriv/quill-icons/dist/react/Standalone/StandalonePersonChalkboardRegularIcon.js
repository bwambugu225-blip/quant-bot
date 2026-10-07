import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePersonChalkboardRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.063 8.688c0 .546.39.937.937.937.508 0 .938-.39.938-.937A.95.95 0 0 0 11 7.75a.925.925 0 0 0-.937.938m3.124 0a2.2 2.2 0 0 1-1.093 1.914c-.703.39-1.524.39-2.188 0-.703-.391-1.094-1.094-1.094-1.915 0-.78.391-1.484 1.094-1.874.664-.391 1.485-.391 2.188 0a2.18 2.18 0 0 1 1.094 1.875m-2.695 4.062c-.273 0-.508.078-.742.156V19h2.5v-6.25zM9.75 25.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V14.43l-1.953 3.633a.64.64 0 0 1-.86.273c-.312-.195-.43-.547-.273-.86L7.72 13.18a3.16 3.16 0 0 1 2.773-1.68H16V8.375c0-1.016.82-1.875 1.875-1.875h8.75c1.016 0 1.875.86 1.875 1.875v8.75c0 1.055-.86 1.875-1.875 1.875h-8.75A1.85 1.85 0 0 1 16 17.125V14h1.25v3.125c0 .352.273.625.625.625h8.75a.64.64 0 0 0 .625-.625v-8.75c0-.312-.312-.625-.625-.625h-8.75a.64.64 0 0 0-.625.625V11.5h1.875c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H13.5v13.125a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V20.25h-2.5z' })));
const ForwardRef = forwardRef(StandalonePersonChalkboardRegularIcon);
export default ForwardRef;
