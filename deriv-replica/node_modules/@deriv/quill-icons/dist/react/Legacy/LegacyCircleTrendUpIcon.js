import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCircleTrendUpIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, fill: '#4BB4B3', rx: 8 }),
    React.createElement("path", { fill: '#fff', d: 'M8 5 4 9h8z' })));
const ForwardRef = forwardRef(LegacyCircleTrendUpIcon);
export default ForwardRef;
