import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyChannelIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M20.732 11.037a1 1 0 1 1 .536 1.926l-18 5a1 1 0 1 1-.536-1.927zm-3.026-5.993a1 1 0 1 1 .588 1.912l-13 4a1 1 0 0 1-.588-1.912z' })));
const ForwardRef = forwardRef(LegacyChannelIcon);
export default ForwardRef;
