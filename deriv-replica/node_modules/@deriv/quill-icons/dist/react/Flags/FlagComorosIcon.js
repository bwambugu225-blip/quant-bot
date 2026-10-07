import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagComorosIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FFD100', d: 'M22 0H2A2 2 0 0 0 .709.473L5.999 4H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', d: 'M12 8h12V4H6z' }),
    React.createElement("path", { fill: '#EF3340', d: 'M6 12h18V8H12z' }),
    React.createElement("path", { fill: '#003DA5', d: 'M.709 15.528c.348.294.799.472 1.291.472h20a2 2 0 0 0 2-2v-2H6z' }),
    React.createElement("path", { fill: '#009639', fillRule: 'evenodd', d: 'M0 14V2C0 1.388.275.84.709.473L11.999 8 .71 15.528A2 2 0 0 1 0 14m5.077-2.5q.486-.002.923-.16C4.752 10.894 3.846 9.567 3.846 8S4.752 5.106 6 4.66a2.7 2.7 0 0 0-.923-.16C3.378 4.5 2 6.067 2 8s1.377 3.5 3.077 3.5m1.441-6h-1v1h1zm0 2h-1v1h1zm0 2h-1v1h1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M6 11.34c-.29.104-.6.16-.923.16C3.377 11.5 2 9.933 2 8s1.378-3.5 3.077-3.5q.485.002.923.16C4.752 5.106 3.846 6.433 3.846 8S4.752 10.894 6 11.34M5.518 5.5h1v1h-1zm0 2h1v1h-1zm0 2h1v1h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagComorosIcon);
export default ForwardRef;
