import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagHaitiIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#D21034', d: 'M9.5 8H0v6a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V8h-9.5v2h-5z' }),
    React.createElement("path", { fill: '#00209F', d: 'M22 0H2a2 2 0 0 0-2 2v6h9.5V6h5v2H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M9.5 6h5v4h-5z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#F2B600', d: 'M12 8c-.268 0-.5.225-.5.505V10h1V8.505A.495.495 0 0 0 12 8' }),
    React.createElement("path", { fill: '#1C672C', fillRule: 'evenodd', d: 'M10.5 8.5c0-.828.666-1.5 1.5-1.5.828 0 1.5.666 1.5 1.5V10h-3zm1 .005c0-.28.232-.505.5-.505.276 0 .5.214.5.505V10h-1z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagHaitiIcon);
export default ForwardRef;
