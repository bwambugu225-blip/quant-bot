import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagVanuatuIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#00963F', d: 'm11.106 10-9 6H22a2 2 0 0 0 2-2v-4z' }),
    React.createElement("path", { fill: '#D4062E', d: 'M11.106 6H24V2a2 2 0 0 0-2-2H2.106z' }),
    React.createElement("path", { fill: '#000', d: 'M11.106 6H24v1H10.803L.849.364A2 2 0 0 1 2 0h.106z' }),
    React.createElement("path", { fill: '#000', fillRule: 'evenodd', d: 'M0 2.202v11.596L8.697 8zM1 8c0 .732.253 1.39.653 1.847l.701-.701C2.138 8.87 2 8.46 2 8c0-.828.448-1.5 1-1.5S4 7.172 4 8s-.448 1.5-1 1.5v1c1.105 0 2-1.12 2-2.5s-.895-2.5-2-2.5S1 6.62 1 8', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', d: 'M2 16a2 2 0 0 1-1.158-.369l.007.005L10.803 9H24v1H11.106l-9 6z' }),
    React.createElement("path", { fill: '#FECF00', fillRule: 'evenodd', d: 'M1.653 9.847C1.253 9.39 1 8.732 1 8c0-1.38.895-2.5 2-2.5S5 6.62 5 8s-.895 2.5-2 2.5v-1c.552 0 1-.672 1-1.5s-.448-1.5-1-1.5S2 7.172 2 8c0 .46.138.87.354 1.146z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FECF00', d: 'M24 7H10.803L.849.364C.335.726 0 1.324 0 2v.202L8.697 8 0 13.798V14c0 .676.335 1.274.849 1.636L10.803 9H24z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagVanuatuIcon);
export default ForwardRef;
