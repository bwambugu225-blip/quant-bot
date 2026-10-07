import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFacebookIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26 16.5c0 5.117-3.867 9.336-8.79 9.96v-6.874h2.696l.547-3.086h-3.242v-1.055c0-1.64.625-2.265 2.266-2.265.507 0 .898.039 1.132.039v-2.735c-.43-.156-1.523-.273-2.148-.273-3.36 0-4.883 1.601-4.883 5V16.5h-2.07v3.086h2.07v6.64A10.015 10.015 0 0 1 6 16.5c0-5.508 4.453-10 10-10 5.508 0 10 4.492 10 10' })));
const ForwardRef = forwardRef(StandaloneFacebookIcon);
export default ForwardRef;
