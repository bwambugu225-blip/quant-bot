import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagMarshallIslandsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#23408D', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#DC7727', d: 'M24 6 0 13.5v-.413L24 3z' }),
    React.createElement("path", { fill: '#fff', d: 'M0 13.911 24 9V6L0 13.5zM6 9l.191-2.491.616 1.5-.233-1.607.996 1.29-.645-1.502 1.28 1.012L7.19 5.924l1.503.63-1.29-.97 1.607.222-1.512-.615L10 5l-2.5-.191 1.511-.615-1.607.222 1.29-.97-1.503.63 1.013-1.278L6.925 3.81l.645-1.502-.996 1.29.233-1.607-.616 1.5L6 1l-.191 2.491-.616-1.5.233 1.607-.996-1.29.645 1.502-1.28-1.012L4.81 4.076l-1.503-.63 1.29.97-1.607-.222 1.512.615L2 5l2.5.191-1.511.615 1.607-.222-1.29.97 1.503-.63-1.013 1.278L5.075 6.19 4.43 7.692l.996-1.29-.233 1.607.616-1.5z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagMarshallIslandsIcon);
export default ForwardRef;
