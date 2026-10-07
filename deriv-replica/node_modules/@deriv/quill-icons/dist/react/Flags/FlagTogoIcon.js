import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagTogoIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#006A4E', d: 'M9.6 0v3.2H24V2a2 2 0 0 0-2-2z' }),
    React.createElement("path", { fill: '#FFCE00', d: 'M24 3.2H9.6v3.2H24z' }),
    React.createElement("path", { fill: '#006A4E', d: 'M24 6.4H9.6v3.2H24z' }),
    React.createElement("path", { fill: '#FFCE00', d: 'M24 9.6H0v3.2h24z' }),
    React.createElement("path", { fill: '#006A4E', d: 'M24 12.8H0v1.212A2 2 0 0 0 2 16h20a2 2 0 0 0 2-2z' }),
    React.createElement("path", { fill: '#D21034', fillRule: 'evenodd', d: 'M9.6 0H2.067C.926 0 0 .895 0 2v7.6h9.6z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm4.8 6.327-1.508.793.288-1.68-1.22-1.187 1.686-.245L4.8 2.48l.754 1.527 1.686.245-1.22 1.19.288 1.678', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagTogoIcon);
export default ForwardRef;
