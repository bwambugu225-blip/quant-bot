import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyVisibility1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.333 4c2.579 0 4.878 1.55 6 4-1.122 2.45-3.415 4-6 4s-4.877-1.55-6-4c1.123-2.45 3.422-4 6-4m0-1C5 3 2.153 5.073 1 8c1.153 2.927 4 5 7.333 5s6.18-2.073 7.334-5c-1.154-2.927-4-5-7.334-5m0 3a2 2 0 1 1-.001 4.001A2 2 0 0 1 8.333 6m0-1c-1.653 0-3 1.347-3 3s1.347 3 3 3 3-1.347 3-3-1.346-3-3-3' })));
const ForwardRef = forwardRef(LegacyVisibility1pxIcon);
export default ForwardRef;
