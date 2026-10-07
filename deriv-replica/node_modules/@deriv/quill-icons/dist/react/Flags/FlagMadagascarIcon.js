import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagMadagascarIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#00843D', d: 'M24 8v6a2 2 0 0 1-2 2H8V8z' }),
    React.createElement("path", { fill: '#F9423A', d: 'M8 0h14a2 2 0 0 1 2 2v6H8z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M0 1.994C0 .893.902 0 2.009 0H8v16H2.009A2 2 0 0 1 0 14.006z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagMadagascarIcon);
export default ForwardRef;
