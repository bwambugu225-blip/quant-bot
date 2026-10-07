import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronsLeftFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm7.602 15.64 7.5-7.5a1.205 1.205 0 0 1 1.757 0c.508.47.508 1.29 0 1.758L10.258 16.5l6.601 6.64c.508.47.508 1.29 0 1.758a1.205 1.205 0 0 1-1.757 0l-7.5-7.5a1.205 1.205 0 0 1 0-1.757m15-7.5a1.205 1.205 0 0 1 1.757 0c.508.47.508 1.29 0 1.758L17.758 16.5l6.601 6.64c.508.47.508 1.29 0 1.758a1.205 1.205 0 0 1-1.757 0l-7.5-7.5a1.205 1.205 0 0 1 0-1.757z' })));
const ForwardRef = forwardRef(StandaloneChevronsLeftFillIcon);
export default ForwardRef;
