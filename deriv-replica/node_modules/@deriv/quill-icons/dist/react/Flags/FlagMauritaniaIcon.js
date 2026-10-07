import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagMauritaniaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#D01C1F', d: 'M0 13h24v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#00A95C', d: 'M24 3H0v10h24z' }),
    React.createElement("path", { fill: '#D01C1F', d: 'M2 0h20a2 2 0 0 1 2 2v1H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: 'gold', d: 'M17.002 5.787c.075.227-.057 1.458-.097 1.694-.316 1.882-2.14 3.733-4.901 3.733-2.762 0-4.428-1.85-4.898-3.733-.077-.175-.18-1.467-.104-1.694 0 1.124 2.608 4.015 5.002 4.015s4.998-2.89 4.998-4.015' }),
    React.createElement("path", { fill: 'gold', fillRule: 'evenodd', d: 'm12.002 7.274-.975.512.186-1.085-.788-.77 1.09-.157.487-.988.487.988 1.09.157-.79.77.187 1.084', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagMauritaniaIcon);
export default ForwardRef;
