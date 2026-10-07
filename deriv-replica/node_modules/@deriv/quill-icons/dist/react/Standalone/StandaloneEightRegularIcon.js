import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEightRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.625 12.438c0 1.64-.82 3.046-2.07 3.906 1.562.742 2.695 2.343 2.695 4.218a4.676 4.676 0 0 1-4.687 4.688h-3.125a4.65 4.65 0 0 1-4.688-4.687 4.66 4.66 0 0 1 2.656-4.22c-1.25-.859-2.031-2.265-2.031-3.905a4.676 4.676 0 0 1 4.688-4.688h1.874a4.7 4.7 0 0 1 4.688 4.688m-4.687 4.687h-2.5A3.443 3.443 0 0 0 11 20.563 3.42 3.42 0 0 0 14.438 24h3.124A3.443 3.443 0 0 0 21 20.563c0-1.875-1.562-3.438-3.437-3.438zm0-1.25a3.443 3.443 0 0 0 3.437-3.437c0-1.876-1.562-3.438-3.437-3.438h-1.875a3.443 3.443 0 0 0-3.438 3.438c0 1.914 1.523 3.437 3.398 3.437h1.914' })));
const ForwardRef = forwardRef(StandaloneEightRegularIcon);
export default ForwardRef;
