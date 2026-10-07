import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagWesternSaharaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#000', d: 'M22 0H2A2 2 0 0 0 .709.473L6.297 5H24V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#fff', d: 'M6.297 11H24V5H6.297L10 8z' }),
    React.createElement("path", { fill: '#007A3D', d: 'M0 14.014A2 2 0 0 0 2 16h20a2 2 0 0 0 2-2v-3H6.297L.71 15.527A2 2 0 0 1 0 14.014' }),
    React.createElement("path", { fill: '#C4111B', d: 'M0 2v12c0 .612.275 1.16.709 1.527L10 8 .709.473A2 2 0 0 0 0 2' }),
    React.createElement("path", { fill: '#C4111B', fillRule: 'evenodd', d: 'm13.828 9.512 1.068-.76 1.057.771-.396-1.248 1.065-.767L15.31 7.5l-.404-1.248-.411 1.245-1.31-.008 1.053.779-.408 1.248z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#C4111B', d: 'M14.5 10.5a2.5 2.5 0 1 1 .47-4.956 2.5 2.5 0 0 0 0 4.912q-.229.044-.47.044' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagWesternSaharaIcon);
export default ForwardRef;
