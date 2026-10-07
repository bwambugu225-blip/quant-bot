import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyChevronUp1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M7.646 5.146a.5.5 0 0 1 .708 0l5.5 5.5a.5.5 0 0 1-.708.708L8 6.207l-5.146 5.147a.5.5 0 0 1-.708-.708z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyChevronUp1pxIcon);
export default ForwardRef;
