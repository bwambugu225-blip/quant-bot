import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPlay2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M4.515 2.125a1 1 0 0 1 1.015.027l8 5a1 1 0 0 1 0 1.696l-8 5A1 1 0 0 1 4 13V3a1 1 0 0 1 .515-.875M6 4.805v6.39L11.113 8z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyPlay2pxIcon);
export default ForwardRef;
