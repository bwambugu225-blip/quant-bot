import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagCroatiaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#150A99', d: 'M0 11h24v3a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 5H0v6h24z' }),
    React.createElement("path", { fill: 'red', d: 'M2 0h20a2 2 0 0 1 2 2v3H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: 'red', fillRule: 'evenodd', d: 'M14.45 10q.05-.243.05-.5V9h-1V8h1V7h-1V6h-1v1h-1V6h-1v1h-1v1h1v1h-1v.5q0 .257.05.5h.95v1H10q.214.286.5.5V11h1v.95a2.5 2.5 0 0 0 1 0V11h1v.5q.286-.214.5-.5h-.5v-1zm-1.95 0V9h1v1zm-1 0v1h1v-1zm0-1h1V8h1V7h-1v1h-1V7h-1v1h1zm0 0h-1v1h1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', d: 'M12.5 9V8h-1v1z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M14.5 9V8h-1V7h1V6h-1v1h-1V6h-1v1h-1V6h-1v1h1v1h-1v1h1v1h-.95c.075.37.232.71.45 1h.5v.5a2.5 2.5 0 0 0 1 .45V11h1v.95c.37-.075.71-.232 1-.45V11h.5a2.5 2.5 0 0 0 .45-1h-.95V9zm-2 0h1V8h-1V7h-1v1h-1v1h1v1h-1v1h1v-1h1v1h1v-1h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#0091E0', fillRule: 'evenodd', d: 'M9.5 5h1v1h-1zm2-1h1v2h-1zm2 1h1v1h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#150A99', fillRule: 'evenodd', d: 'M12.5 4h1v2h-1zm-2 0h1v2h-1z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagCroatiaIcon);
export default ForwardRef;
