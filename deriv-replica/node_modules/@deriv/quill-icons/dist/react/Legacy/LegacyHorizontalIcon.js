import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyHorizontalIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M21 13H3a1 1 0 1 1 0-2h18a1 1 0 1 1 0 2' })));
const ForwardRef = forwardRef(LegacyHorizontalIcon);
export default ForwardRef;
