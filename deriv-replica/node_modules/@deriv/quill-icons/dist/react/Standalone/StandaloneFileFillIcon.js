import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9 9c0-1.367 1.094-2.5 2.5-2.5h6.25v5c0 .703.547 1.25 1.25 1.25h5V24c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 9 24zm15 2.5h-5v-5z' })));
const ForwardRef = forwardRef(StandaloneFileFillIcon);
export default ForwardRef;
