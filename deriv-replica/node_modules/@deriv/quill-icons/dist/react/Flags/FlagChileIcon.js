import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagChileIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#DA281B', d: 'M0 8h24v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#fff', d: 'M22 0H8v8h16V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#0033A0', d: 'M8 0H2a2 2 0 0 0-2 2v6h8z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm4 4.987-.975.513.186-1.086-.788-.77 1.09-.157L4 2.5l.488.988 1.09.157-.79.77.186 1.085', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagChileIcon);
export default ForwardRef;
