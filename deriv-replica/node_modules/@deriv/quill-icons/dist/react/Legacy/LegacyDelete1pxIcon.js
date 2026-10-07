import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyDelete1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.5 1A1.5 1.5 0 0 1 12 2.5V3h2.5a.5.5 0 0 1 0 1H14v9.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V4h-.5a.5.5 0 0 1 0-1H4v-.5A1.5 1.5 0 0 1 5.5 1zM13 4H3v9.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5zM8 6a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5A.5.5 0 0 1 8 6m2.5 0a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m-5 0a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0v-5a.5.5 0 0 1 .5-.5m5-4h-5a.5.5 0 0 0-.5.5V3h6v-.5a.5.5 0 0 0-.5-.5' })));
const ForwardRef = forwardRef(LegacyDelete1pxIcon);
export default ForwardRef;
