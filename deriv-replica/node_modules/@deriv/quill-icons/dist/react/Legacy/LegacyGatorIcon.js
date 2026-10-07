import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyGatorIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M2 22v-8.57h3V7.71h3V2h3v3.81h3V22z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M14 22V8.67h3v4.76h3v2.859l2 .001V22z' })));
const ForwardRef = forwardRef(LegacyGatorIcon);
export default ForwardRef;
