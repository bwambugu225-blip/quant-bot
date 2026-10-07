import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneGoogleIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M25.531 16.734c0 5.547-3.789 9.453-9.375 9.453A9.636 9.636 0 0 1 6.47 16.5a9.66 9.66 0 0 1 9.687-9.687c2.578 0 4.805.976 6.485 2.539l-2.657 2.539c-3.437-3.32-9.843-.82-9.843 4.609 0 3.398 2.695 6.133 6.015 6.133 3.828 0 5.274-2.735 5.469-4.18h-5.469v-3.32h9.219c.078.508.156.976.156 1.601' })));
const ForwardRef = forwardRef(StandaloneGoogleIcon);
export default ForwardRef;
