import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagTurkeyIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#E92434', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', d: 'm15.013 8.542-1.045.745.385-1.224-1.031-.764 1.283-.012.408-1.216.407 1.216 1.283.012-1.03.764.385 1.224z' }),
    React.createElement("path", { fill: '#fff', d: 'M11 4c1.282 0 2.424.603 3.156 1.542a3.48 3.48 0 0 0-2.045-.653c-1.84 0-3.333 1.393-3.333 3.111s1.492 3.111 3.333 3.111c.77 0 1.48-.244 2.045-.654A4 4 0 1 1 11 4' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagTurkeyIcon);
export default ForwardRef;
