import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagAlbaniaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E71910', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#333', d: 'm10.5 3.5 1.5 1 1.5-1 1 1h-1l1 1 2-1v5l-3-1 1 2h1l-1 1-1-1-1.5 2-1.5-2-1 1-1-1h1l1-2-3 1v-5l2 1 1-1h-1z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagAlbaniaIcon);
export default ForwardRef;
