import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagUzbekistanIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#20BD42', d: 'M0 12h24v2a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#D4112A', d: 'M24 11H0v1h24z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 5H0v6h24z' }),
    React.createElement("path", { fill: '#D4112A', d: 'M24 4H0v1h24z' }),
    React.createElement("path", { fill: '#02A3BD', d: 'M2 0h20a2 2 0 0 1 2 2v2H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M5 3.915a1.5 1.5 0 1 1 0-2.83 1.5 1.5 0 0 0 0 2.83', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#78CDDB', fillRule: 'evenodd', d: 'M6 2h1v1H6zm1-1h1v1H7zm1 1h1v1H8zm1-1h1v1H9zm1 1h1v1h-1zM9 3h1v1H9zM7 3h1v1H7z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagUzbekistanIcon);
export default ForwardRef;
