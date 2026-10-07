import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleChevronDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m-4.727 9.414 4.063 4.063c.351.39.937.39 1.328 0l4.023-4.063a.856.856 0 0 0 0-1.289c-.351-.39-.937-.39-1.328 0l-3.398 3.398-3.399-3.398a.856.856 0 0 0-1.289 0 .856.856 0 0 0 0 1.29' })));
const ForwardRef = forwardRef(StandaloneCircleChevronDownFillIcon);
export default ForwardRef;
