import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagZambiaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#198A00', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#EF7D00', d: 'M24 7.999h-3V16h1a2 2 0 0 0 2-2z' }),
    React.createElement("path", { fill: '#000001', fillRule: 'evenodd', d: 'M18 7.999h3V16h-3z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#DE2010', fillRule: 'evenodd', d: 'M15.003 7.999H18V16h-3z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#EF7D00', d: 'M15.5 3.012a1 1 0 0 0 1 1 1 1 0 0 0 1 1 1 1 0 0 0 1 1h2a1 1 0 0 0 1-1 1 1 0 0 0 1-1 1 1 0 0 0 1-1h-3a1 1 0 1 0-2 0z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagZambiaIcon);
export default ForwardRef;
