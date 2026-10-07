import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagBeninIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#EB0624', d: 'M24 14V8H8v8h14a2 2 0 0 0 2-2' }),
    React.createElement("path", { fill: '#FDD200', d: 'M24 2a2 2 0 0 0-2-2H8v8h16z' }),
    React.createElement("path", { fill: '#00884F', d: 'M0 2a2 2 0 0 1 2-2h6v16H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagBeninIcon);
export default ForwardRef;
