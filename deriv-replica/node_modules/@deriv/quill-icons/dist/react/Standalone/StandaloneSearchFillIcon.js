import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSearchFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 14.625a8.12 8.12 0 0 1-1.562 4.805l4.921 4.96c.508.47.508 1.29 0 1.758a1.205 1.205 0 0 1-1.757 0l-4.961-4.96c-1.328 1.015-3.008 1.562-4.766 1.562A8.12 8.12 0 0 1 6 14.625C6 10.172 9.633 6.5 14.125 6.5c4.453 0 8.125 3.672 8.125 8.125m-8.125 5.625a5.58 5.58 0 0 0 4.844-2.812c1.015-1.72 1.015-3.868 0-5.625C17.953 10.093 16.117 9 14.125 9c-2.031 0-3.867 1.094-4.883 2.813-1.015 1.757-1.015 3.906 0 5.624a5.6 5.6 0 0 0 4.883 2.813' })));
const ForwardRef = forwardRef(StandaloneSearchFillIcon);
export default ForwardRef;
