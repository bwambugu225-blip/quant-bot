import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagMoroccoIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#C1272D', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#006233', fillRule: 'evenodd', d: 'm12 3.963.98 3.016h3.16l-2.558 1.855.975 3.003L12 9.982l-2.558 1.855.976-3.003L7.86 6.98h3.16zM10.812 7.62h-.978l.792.574zm.359.97.315-.97h1.028l.315.97-.829.6zm-.208.64-.303.933.794-.577zm1.583.356.794.577-.303-.933zm.828-1.392.792-.574h-.978zM12.306 6.98h-.612L12 6.037z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagMoroccoIcon);
export default ForwardRef;
