import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyLineIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'm3.707 21.707 18-18a1 1 0 0 0-1.414-1.414l-18 18a1 1 0 1 0 1.414 1.414' })));
const ForwardRef = forwardRef(LegacyLineIcon);
export default ForwardRef;
