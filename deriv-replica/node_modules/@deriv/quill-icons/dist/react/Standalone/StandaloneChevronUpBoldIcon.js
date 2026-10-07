import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronUpBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.336 10.836a.92.92 0 0 1 1.289 0l7.54 7.5c.35.39.35.977 0 1.328-.392.39-.977.39-1.33 0L16 12.828l-6.836 6.836c-.39.39-.976.39-1.328 0a.856.856 0 0 1 0-1.289z' })));
const ForwardRef = forwardRef(StandaloneChevronUpBoldIcon);
export default ForwardRef;
