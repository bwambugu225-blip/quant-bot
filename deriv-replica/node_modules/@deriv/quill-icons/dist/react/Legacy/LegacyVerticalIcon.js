import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyVerticalIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M12 22a1 1 0 0 1-1-1V3a1 1 0 1 1 2 0v18a1 1 0 0 1-1 1' })));
const ForwardRef = forwardRef(LegacyVerticalIcon);
export default ForwardRef;
