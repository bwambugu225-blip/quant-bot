import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSaintVincentAndGrenadinesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#007C2E', d: 'M16 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6z' }),
    React.createElement("path", { fill: '#007C2E', fillRule: 'evenodd', d: 'M9.083 8.333 10.25 6l1.167 2.333-1.167 2.334zm3.5 0L13.75 6l1.167 2.333-1.167 2.334zm-1.75 2.334L12 8.333l1.167 2.334L12 13z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FCD022', fillRule: 'evenodd', d: 'M8 0h8v16H8zm2.25 6L9.083 8.333l1.167 2.334 1.167-2.334zm3.5 0-1.167 2.333 1.167 2.334 1.167-2.334zM12 8.333l-1.167 2.334L12 13l1.167-2.333z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#002674', d: 'M2 0h6v16H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSaintVincentAndGrenadinesIcon);
export default ForwardRef;
