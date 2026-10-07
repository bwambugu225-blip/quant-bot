import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyStochasticOscillatorIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M20.2 15.6a1 1 0 0 0 1.6-1.2l-9-12a1 1 0 0 0-1.507-.107L7.586 6H3a1 1 0 0 0 0 2h5a1 1 0 0 0 .707-.293l3.185-3.185z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M20.2 21.6a1 1 0 0 0 1.6-1.2l-9-12a1 1 0 0 0-1.507-.107L7.586 12H3a1 1 0 1 0 0 2h5a1 1 0 0 0 .707-.293l3.185-3.185z' }),
    React.createElement("path", { fill: '#D6DADB', d: 'M14 17a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2zM7 2a1 1 0 0 1 0 2H3a1 1 0 0 1 0-2zm14 0a1 1 0 1 1 0 2h-4a1 1 0 1 1 0-2z' })));
const ForwardRef = forwardRef(LegacyStochasticOscillatorIcon);
export default ForwardRef;
