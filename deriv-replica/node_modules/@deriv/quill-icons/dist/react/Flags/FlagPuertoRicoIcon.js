import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagPuertoRicoIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#ED0000', d: 'M22 0H2A2 2 0 0 0 .709.473L4.836 3H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', d: 'M9.734 6H24V3H4.836z' }),
    React.createElement("path", { fill: '#ED0000', d: 'M9.734 10H24V6H9.734L13 8z' }),
    React.createElement("path", { fill: '#fff', d: 'M4.836 13H24v-3H9.734z' }),
    React.createElement("path", { fill: '#ED0000', d: 'M0 14.014A2 2 0 0 0 2 16h20a2 2 0 0 0 2-2v-1H4.836L.709 15.527A2 2 0 0 1 0 14.014' }),
    React.createElement("path", { fill: '#004EF1', d: 'M0 2v12c0 .612.275 1.16.709 1.527L13 8 .709.473A2 2 0 0 0 0 2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M4.455 9.207 2.947 10l.288-1.68-1.22-1.187L3.7 6.888l.754-1.528.754 1.527 1.686.245-1.22 1.19L5.963 10', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagPuertoRicoIcon);
export default ForwardRef;
