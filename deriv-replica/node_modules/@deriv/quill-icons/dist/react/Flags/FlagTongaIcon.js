import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagTongaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#C10000', d: 'M12 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8h12z' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M2 0h10v8H0V2a2 2 0 0 1 2-2m4.855 1H5.14l.002 2.14H3v1.72h2.143L5.145 7h1.71V4.86H9V3.14H6.855z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#C10000', d: 'M5.14 1h1.715v2.14H9v1.72H6.855V7h-1.71l-.002-2.14H3V3.14h2.142z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagTongaIcon);
export default ForwardRef;
