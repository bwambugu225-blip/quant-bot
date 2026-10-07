import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMagnifyingGlassPlusRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.125 7.75c-2.46 0-4.727 1.328-5.977 3.438-1.21 2.148-1.21 4.765 0 6.874a6.89 6.89 0 0 0 5.977 3.438 6.87 6.87 0 0 0 5.938-3.437c1.21-2.11 1.21-4.727 0-6.875-1.25-2.11-3.516-3.438-5.938-3.438m0 15A8.12 8.12 0 0 1 6 14.625C6 10.172 9.633 6.5 14.125 6.5c4.453 0 8.125 3.672 8.125 8.125 0 2.031-.742 3.867-1.953 5.313l5.508 5.507a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0l-5.508-5.547c-1.406 1.25-3.28 1.953-5.273 1.953m-.625-4.375V15.25h-3.125a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625H13.5v-3.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625V14h3.125c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H14.75v3.125a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneMagnifyingGlassPlusRegularIcon);
export default ForwardRef;
