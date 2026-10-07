import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagTunisiaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E70013', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', d: 'M12.017 4a4 4 0 1 0-.034 8 4 4 0 0 0 .034-8m2.397 5.786a2.996 2.996 0 1 1 0-3.562 2.397 2.397 0 1 0 0 3.562m-.157-.722-1.245-.403-.769 1.059V8.41l-1.245-.406 1.245-.406V6.29l.77 1.06 1.244-.404-.769 1.059z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagTunisiaIcon);
export default ForwardRef;
