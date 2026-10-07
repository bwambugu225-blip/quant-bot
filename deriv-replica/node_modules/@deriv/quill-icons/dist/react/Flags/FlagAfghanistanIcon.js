import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagAfghanistanIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#009B00', d: 'M16 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6z' }),
    React.createElement("path", { fill: '#C10000', d: 'M16 0H8v16h8z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M12 10.5a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 0 0 5m0-1c.828 0 1.5-.895 1.5-2s-.672-2-1.5-2-1.5.895-1.5 2 .672 2 1.5 2m0-1c.276 0 .5-.448.5-1s-.224-1-.5-1-.5.448-.5 1 .224 1 .5 1', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#333', d: 'M2 0h6v16H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagAfghanistanIcon);
export default ForwardRef;
