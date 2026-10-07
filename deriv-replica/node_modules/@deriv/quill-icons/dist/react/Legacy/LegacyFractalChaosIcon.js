import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyFractalChaosIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'm17 2-5 11 5-1.62L22 13z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm7 22 5-11-5 1.62L2 11z' })));
const ForwardRef = forwardRef(LegacyFractalChaosIcon);
export default ForwardRef;
