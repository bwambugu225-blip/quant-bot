import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagMyanmarIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M12.001 11.291 8.751 13l.62-3.618-2.626-2.565 3.631-.523L12.001 3l1.623 3.294 3.631.523-2.63 2.565.623 3.616', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#EA2839', d: 'M9.094 11H0v3a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-3h-9.096l.344 1.998-3.247-1.707L8.751 13z' }),
    React.createElement("path", { fill: '#FECB00', d: 'M22 0H2a2 2 0 0 0-2 2v3h11.015L12 3l.985 2H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#34B233', d: 'M11.015 5H0v6h9.094l.277-1.618-2.626-2.565 3.631-.523zM24 5H12.986l.637 1.294 3.632.523-2.63 2.565.279 1.618H24z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagMyanmarIcon);
export default ForwardRef;
