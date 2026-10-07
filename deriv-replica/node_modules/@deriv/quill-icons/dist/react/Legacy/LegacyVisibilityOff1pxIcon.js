import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyVisibilityOff1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.177 2.118a.5.5 0 0 1 .646.764l-2.048 1.732A7.9 7.9 0 0 1 15.333 8c-1.153 2.927-4 5-7.333 5a7.83 7.83 0 0 1-3.908-1.038l-2.269 1.92a.5.5 0 1 1-.646-.764l2.047-1.733A7.9 7.9 0 0 1 .667 8C1.82 5.073 4.667 3 8 3a7.83 7.83 0 0 1 3.909 1.038zm-2.265 3.226L10.58 6.472c.267.448.42.97.42 1.528 0 1.653-1.347 3-3 3-.736 0-1.41-.267-1.933-.708l-1.106.935C5.88 11.727 6.914 12 8 12c2.585 0 4.877-1.55 6-4a7.05 7.05 0 0 0-2.088-2.656M8 4C5.422 4 3.122 5.55 2 8a7.05 7.05 0 0 0 2.086 2.656L5.42 9.528A3 3 0 0 1 5 8c0-1.653 1.347-3 3-3 .736 0 1.411.267 1.934.709l1.105-.935A6.34 6.34 0 0 0 8 4m1.802 3.13L6.845 9.633A2 2 0 0 0 9.802 7.13M8 6a2 2 0 0 0-1.802 2.87l2.957-2.503A2 2 0 0 0 8 6' })));
const ForwardRef = forwardRef(LegacyVisibilityOff1pxIcon);
export default ForwardRef;
