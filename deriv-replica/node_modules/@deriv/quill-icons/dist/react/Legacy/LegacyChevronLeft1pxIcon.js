import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyChevronLeft1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M10.854 2.146a.5.5 0 0 1 0 .708L5.707 8l5.147 5.146a.5.5 0 0 1-.708.708l-5.5-5.5a.5.5 0 0 1 0-.708l5.5-5.5a.5.5 0 0 1 .708 0', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyChevronLeft1pxIcon);
export default ForwardRef;
