import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPlaceholder24pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 24, height: 24, fill: '#333', rx: 4 })));
const ForwardRef = forwardRef(LegacyPlaceholder24pxIcon);
export default ForwardRef;
