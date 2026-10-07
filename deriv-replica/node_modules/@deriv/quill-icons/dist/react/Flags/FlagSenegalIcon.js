import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSenegalIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E31B23', d: 'M16 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6z' }),
    React.createElement("path", { fill: '#FDEF42', d: 'M16 0H8v16h8z' }),
    React.createElement("path", { fill: '#00853F', d: 'M2 0h6v16H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#00853F', fillRule: 'evenodd', d: 'm11.878 9.25-1.47.773.28-1.637L9.5 7.226l1.643-.237.735-1.489.735 1.49 1.643.237-1.19 1.16.28 1.636', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSenegalIcon);
export default ForwardRef;
