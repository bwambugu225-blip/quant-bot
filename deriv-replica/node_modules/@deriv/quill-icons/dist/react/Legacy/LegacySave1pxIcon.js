import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacySave1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M3.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H4V9.5A1.5 1.5 0 0 1 5.5 8h5A1.5 1.5 0 0 1 12 9.5V13h.5a.5.5 0 0 0 .5-.5V5.914a.5.5 0 0 0-.146-.353L11 3.707V5.5A1.5 1.5 0 0 1 9.5 7h-4A1.5 1.5 0 0 1 4 5.5V3zm0-1A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5V5.914a1.5 1.5 0 0 0-.44-1.06l-2.414-2.415A1.5 1.5 0 0 0 10.086 2zM5 3v2.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V3zm6 10V9.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5V13z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacySave1pxIcon);
export default ForwardRef;
