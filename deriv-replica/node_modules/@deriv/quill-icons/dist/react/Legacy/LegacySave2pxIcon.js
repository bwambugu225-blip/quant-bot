import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacySave2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M1 4a3 3 0 0 1 3-3h6.172a3 3 0 0 1 2.12.879l1.83 1.828A3 3 0 0 1 15 5.828V12a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3zm3-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3a1 1 0 0 0 1-1V5.828a1 1 0 0 0-.293-.707L11 3.414V5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2 0v2h3V3zm4 10v-3H6v3z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacySave2pxIcon);
export default ForwardRef;
