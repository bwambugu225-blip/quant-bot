import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyFullscreen1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1H14v-3.5a.5.5 0 0 1 .5-.5m-13 0a.5.5 0 0 1 .5.5V14h3.5a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5m4-9a.5.5 0 0 1 0 1H2v3.5a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5zm9 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V2h-3.5a.5.5 0 0 1 0-1z' })));
const ForwardRef = forwardRef(LegacyFullscreen1pxIcon);
export default ForwardRef;
