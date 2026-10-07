import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagDomincanRepublicIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("g", { fillRule: 'evenodd', clipRule: 'evenodd' },
        React.createElement("path", { fill: '#002D62', d: 'M10 0H2a2 2 0 0 0-2 2v4h10zm4 16h8a2 2 0 0 0 2-2v-4H14z' }),
        React.createElement("path", { fill: '#CE1126', d: 'M14 0h8a2 2 0 0 1 2 2v4H14zM0 10v4a2 2 0 0 0 2 2h8v-6z' }),
        React.createElement("path", { fill: '#fff', d: 'M14 0h-4v6H0v4h10v6h4v-6h10V6H14zm-3.414 9.121a2 2 0 0 1 0-2.828l.471.471a1.333 1.333 0 1 0 1.886 0l.471-.471a2 2 0 1 1-2.828 2.828m2.08-1.414a.667.667 0 1 1-1.333 0 .667.667 0 0 1 1.333 0' }),
        React.createElement("path", { fill: '#0F6D1A', d: 'M10.586 6.293a2 2 0 1 0 2.828 0l-.471.471a1.333 1.333 0 1 1-1.886 0z' }),
        React.createElement("path", { fill: '#042F60', d: 'M12 8.374a.667.667 0 1 0 0-1.333.667.667 0 0 0 0 1.333' }),
        React.createElement("path", { fill: '#000', fillOpacity: 0.08, d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' }))));
const ForwardRef = forwardRef(FlagDomincanRepublicIcon);
export default ForwardRef;
