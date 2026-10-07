import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCashierIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M1.5 6a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5zM15 1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1h-2v1h1.5A1.5 1.5 0 0 1 16 6.5v7a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-7A1.5 1.5 0 0 1 1.5 5H2V3h5v2h5V4h-2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm0 10H1v1h14zm-1.5-2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-5 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m11-2h-3a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1m-5 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1m-2 0a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1M6 4H3v1h3zm9-2h-5v1h5z' })));
const ForwardRef = forwardRef(LegacyCashierIcon);
export default ForwardRef;
