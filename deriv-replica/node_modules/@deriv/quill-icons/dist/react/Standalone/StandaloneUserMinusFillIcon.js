import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUserMinusFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 11.5c0-1.758.938-3.398 2.5-4.297 1.523-.898 3.438-.898 5 0 1.523.899 2.5 2.54 2.5 4.297 0 1.797-.977 3.438-2.5 4.336-1.562.898-3.477.898-5 0a4.97 4.97 0 0 1-2.5-4.336M3.5 25.367c0-3.867 3.086-6.992 6.953-6.992h3.555A6.985 6.985 0 0 1 21 25.367c0 .625-.547 1.133-1.172 1.133H4.633A1.134 1.134 0 0 1 3.5 25.367m18.438-11.054h5.625a.95.95 0 0 1 .937.937c0 .547-.43.938-.937.938h-5.625c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937' })));
const ForwardRef = forwardRef(StandaloneUserMinusFillIcon);
export default ForwardRef;
