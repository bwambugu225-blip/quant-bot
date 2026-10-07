import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagEquatorialGuineaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E32118', d: 'M0 14.014A2 2 0 0 0 2 16h20a2 2 0 0 0 2-2v-3H3.891L.71 15.527A2 2 0 0 1 0 14.014' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M24 11H3.891L6 8 3.891 5H24zM10 7.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m.5.5v-.5h-1V8a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0v1.5h1zm0 0a.5.5 0 1 1 1 0 .5.5 0 0 1-1 0m1.5-.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FFD900', fillRule: 'evenodd', d: 'M10 7.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#009432', fillRule: 'evenodd', d: 'M11 8.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1m2 0a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#A46620', fillRule: 'evenodd', d: 'M11.5 7.5h1v2h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#0073CE', d: 'M0 2v12c0 .612.275 1.16.709 1.527L6 8 .709.473A2 2 0 0 0 0 2' }),
    React.createElement("path", { fill: '#3E9A00', d: 'M22 0H2A2 2 0 0 0 .709.473L3.891 5H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagEquatorialGuineaIcon);
export default ForwardRef;
