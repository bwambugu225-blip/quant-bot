import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCut2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2M1 4a3 3 0 1 1 5.708 1.293L8 6.586 13.586 1H15v1.414L9.414 8 15 13.586V15h-1.414L8 9.414l-1.292 1.293a3 3 0 1 1-1.414-1.414L6.585 8 5.293 6.708A3 3 0 0 1 1 4m3 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyCut2pxIcon);
export default ForwardRef;
