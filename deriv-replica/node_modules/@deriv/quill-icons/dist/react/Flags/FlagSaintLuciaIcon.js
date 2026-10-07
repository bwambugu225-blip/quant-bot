import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSaintLuciaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#6CF', d: 'M22 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#000', d: 'M8.42 12.384 11.957 8l3.629 4.408-3.626-8.757z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm11.958 2 4.927 11.973h-.01l-1.288-1.565-3.626-8.757-3.542 8.733L7.115 14zM7.115 14l9.76-.027.01.012z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FFCE00', d: 'M8.42 12.384 7.114 14l9.76-.027-1.288-1.565L11.957 8z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSaintLuciaIcon);
export default ForwardRef;
