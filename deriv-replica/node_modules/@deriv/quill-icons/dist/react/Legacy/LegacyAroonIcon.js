import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAroonIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'm12.752 8.654 3.168 2.376a1 1 0 0 0 1.45-.273l4.48-7.23a1 1 0 1 0-1.7-1.054l-3.904 6.301L13.12 6.43a1 1 0 0 0-1.423.231l-9.52 13.77a1 1 0 0 0 1.646 1.138z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm5.845 7.57 9.323 13.985a1 1 0 0 0 1.54.152l5-5a1 1 0 0 0-1.415-1.414l-4.138 4.137L6.832 5.445a1 1 0 0 0-1.54-.152l-3 3a1 1 0 0 0 1.415 1.414z' })));
const ForwardRef = forwardRef(LegacyAroonIcon);
export default ForwardRef;
