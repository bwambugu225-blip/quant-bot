import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagGreeceIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#fff', d: 'M0 14h24a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2' }),
    React.createElement("path", { fill: '#006CC7', fillRule: 'evenodd', d: 'M0 13.5h24v.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', d: 'M24 11.5H0v2h24z' }),
    React.createElement("path", { fill: '#006CC7', d: 'M24 9H0v2.5h24z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 7H0v2h24z' }),
    React.createElement("path", { fill: '#006CC7', d: 'M24 4.5H0V7h24z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 2.5H0v2h24z' }),
    React.createElement("path", { fill: '#006CC7', d: 'M2 0h20a2 2 0 0 1 2 2v.5H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#006CC7', fillRule: 'evenodd', d: 'M11 7v2H0V7zm0-4.5v2H0v-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M6.875 0v4.5H11V7H6.875v4.5h-2.75V7H0V4.5h4.125V0z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagGreeceIcon);
export default ForwardRef;
