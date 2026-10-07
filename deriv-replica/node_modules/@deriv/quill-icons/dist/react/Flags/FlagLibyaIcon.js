import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagLibyaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#239E46', d: 'M0 12h24v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#000', d: 'M24 4H0v8h24z' }),
    React.createElement("path", { fill: '#E70013', d: 'M2 0h20a2 2 0 0 1 2 2v2H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm15.139 8.6-.656 1.017-.09-1.208-1.17-.31 1.12-.457-.066-1.21.782.925 1.129-.437-.638 1.029.765.939z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', d: 'M13.84 10.19a2.8 2.8 0 0 1-1.964.81C10.287 11 9 9.657 9 8s1.287-3 2.876-3c.76 0 1.45.307 1.964.81a2.74 2.74 0 0 0-1.18-.265c-1.444 0-2.614 1.1-2.614 2.455 0 1.356 1.17 2.454 2.614 2.454.424 0 .825-.095 1.18-.263' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagLibyaIcon);
export default ForwardRef;
