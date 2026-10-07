import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSloveniaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E53B35', d: 'M2 16h20a2 2 0 0 0 2-2v-3H0v3a2 2 0 0 0 2 2' }),
    React.createElement("path", { fill: '#fff', d: 'M2 0h20a2 2 0 0 1 2 2v3H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#0268AE', d: 'M24 11V5H0v6z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#EF1F28', d: 'M5.5 3H6a1 1 0 0 1 1 1v2.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h.5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1' }),
    React.createElement("path", { fill: '#FFE200', fillRule: 'evenodd', d: 'M4.5 4h1v1h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M3.5 6 5 5.5l1.5.5-1 1h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#0268AE', fillRule: 'evenodd', d: 'M5.5 3h-1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1l-1-1L5 5.5l1.5.5-1 1a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1m-1 1h1v1h-1z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSloveniaIcon);
export default ForwardRef;
