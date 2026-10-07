import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBriefcaseFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.188 8.375a.31.31 0 0 0-.313.313v1.562h6.25V8.688a.336.336 0 0 0-.312-.313zM11 8.688c0-1.172.977-2.188 2.188-2.188h5.624C19.985 6.5 21 7.516 21 8.688v1.562h2.5c1.367 0 2.5 1.133 2.5 2.5v3.75H6v-3.75c0-1.367 1.094-2.5 2.5-2.5H11zm15 9.062v5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-5h7.5V19c0 .703.547 1.25 1.25 1.25h2.5c.664 0 1.25-.547 1.25-1.25v-1.25z' })));
const ForwardRef = forwardRef(StandaloneBriefcaseFillIcon);
export default ForwardRef;
