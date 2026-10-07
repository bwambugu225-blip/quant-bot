import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAwesomeOscillatorIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M9 6.76V22H6V6.76zM13.5 2v20h-3V2zM5 11.52V22H2V11.52z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M18 4.86V22h-3V4.86zm4 5.71V22h-3V10.57z' })));
const ForwardRef = forwardRef(LegacyAwesomeOscillatorIcon);
export default ForwardRef;
