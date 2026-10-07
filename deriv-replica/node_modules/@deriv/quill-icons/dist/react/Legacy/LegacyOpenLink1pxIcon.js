import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyOpenLink1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M1 2.5A1.5 1.5 0 0 1 2.5 1h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 0-.5.5v11a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 1 0v3a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5zm9-1a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 15 2.5v3a.5.5 0 0 1-1 0V2.707L8.854 7.854a.5.5 0 1 1-.708-.708L13.293 2H10.5a.5.5 0 0 1-.5-.5', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyOpenLink1pxIcon);
export default ForwardRef;
