import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagChannelIslandsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#fff', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#E8112D', d: 'M14 0h-4v6H0v4h10v6h4v-6h10V6H14z' }),
    React.createElement("path", { fill: '#F9DD16', d: 'M11.5 3v4.5H7l-1-1v3l1-1h4.5V13l-1 1h3l-1-1V8.5H17l1 1v-3l-1 1h-4.5V3l1-1h-3z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagChannelIslandsIcon);
export default ForwardRef;
