import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAlligatorIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M20.19 2.415a1 1 0 0 1 1.62 1.17l-7.393 10.237 3.86 5.791 2.168-1.445a1 1 0 0 1 1.11 1.664l-3 2a1 1 0 0 1-1.387-.277l-4.001-6.003-4.356 6.034a1 1 0 0 1-1.26.308l-.106-.062-2.318-1.545-1.42 1.42a1 1 0 0 1-1.414-1.414l2-2a1 1 0 0 1 1.262-.125l2.198 1.466 4.23-5.858L5.952 4.73 3.8 7.6a1 1 0 1 1-1.6-1.2l3-4a1 1 0 0 1 1.632.045l6.4 9.6z' }),
    React.createElement("path", { fill: '#FF444F', d: 'm6.27 12.144 11.414 3.805A1 1 0 0 0 18.8 15.6l3-4a1 1 0 0 0-1.6-1.2l-2.567 3.423-11.317-3.772a1 1 0 0 0-1.023.242l-3 3a1 1 0 1 0 1.414 1.414z' })));
const ForwardRef = forwardRef(LegacyAlligatorIcon);
export default ForwardRef;
