import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEnvelopeBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 10.875a.64.64 0 0 0-.625.625v.898l6.719 5.508a2.18 2.18 0 0 0 2.773 0l6.758-5.508V11.5c0-.312-.312-.625-.625-.625zm-.625 3.945v6.68c0 .352.273.625.625.625h15a.64.64 0 0 0 .625-.625v-6.68l-5.547 4.532c-1.523 1.25-3.672 1.25-5.156 0zM6 11.5C6 10.133 7.094 9 8.5 9h15c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-15A2.47 2.47 0 0 1 6 21.5z' })));
const ForwardRef = forwardRef(StandaloneEnvelopeBoldIcon);
export default ForwardRef;
