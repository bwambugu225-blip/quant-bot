import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagGuineaBissauIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#009E49', d: 'M24 8v6a2 2 0 0 1-2 2H8V8z' }),
    React.createElement("path", { fill: '#FCD116', d: 'M8 0h14a2 2 0 0 1 2 2v6H8z' }),
    React.createElement("path", { fill: '#CE1126', fillRule: 'evenodd', d: 'M0 1.994C0 .893.902 0 2.009 0H8v16H2.009A2 2 0 0 1 0 14.006z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillRule: 'evenodd', d: 'm4 9.489-1.47.772.28-1.636-1.188-1.16 1.643-.237L4 5.738l.735 1.49 1.643.237-1.19 1.16.28 1.636', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagGuineaBissauIcon);
export default ForwardRef;
