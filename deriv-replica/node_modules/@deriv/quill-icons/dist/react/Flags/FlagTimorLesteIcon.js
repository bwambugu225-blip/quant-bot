import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagTimorLesteIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#DA291C', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#FFC72C', d: 'M0 2v12c0 .612.275 1.16.709 1.527L15 8 .709.473A2 2 0 0 0 0 2' }),
    React.createElement("path", { fill: '#000', d: 'M0 2v12c0 .612.275 1.16.709 1.527L11 8 .709.473A2 2 0 0 0 0 2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm4.81 9.145-1.062 1.332-.41-1.654-1.595-.597 1.446-.902.076-1.702L4.57 6.717l1.643-.452-.64 1.58.938 1.42', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagTimorLesteIcon);
export default ForwardRef;
