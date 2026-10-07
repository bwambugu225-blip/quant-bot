import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSortFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.102 8.14a1.205 1.205 0 0 1 1.757 0l5 5c.352.352.47.9.274 1.368s-.625.781-1.133.781H11a1.28 1.28 0 0 1-1.172-.781 1.26 1.26 0 0 1 .274-1.367zm0 16.758-5-5a1.26 1.26 0 0 1-.274-1.367A1.28 1.28 0 0 1 11 17.75h10c.469 0 .938.313 1.133.781a1.26 1.26 0 0 1-.274 1.367l-5 5a1.205 1.205 0 0 1-1.757 0' })));
const ForwardRef = forwardRef(StandaloneSortFillIcon);
export default ForwardRef;
