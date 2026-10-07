import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyChevronDown2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm8 9.586 5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 1.414-1.414z' })));
const ForwardRef = forwardRef(LegacyChevronDown2pxIcon);
export default ForwardRef;
