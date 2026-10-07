import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSeychellesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#D92223', d: 'M24 5V2a2 2 0 0 0-2-2h-5L.586 15.415q.106.105.228.196z' }),
    React.createElement("path", { fill: '#FCD955', d: 'M.606 15.434 17 0H9L.431 15.24q.08.103.175.194' }),
    React.createElement("path", { fill: '#003D88', d: 'M.431 15.24 9.001 0H2A2 2 0 0 0 .004 1.874v12.252c.026.42.182.804.427 1.114' }),
    React.createElement("path", { fill: '#007A39', d: 'M23.99 10 1 15.739c.292.166.63.261.99.261h20a2 2 0 0 0 2-2z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 5 .814 15.61q.093.069.194.127L23.989 10z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSeychellesIcon);
export default ForwardRef;
