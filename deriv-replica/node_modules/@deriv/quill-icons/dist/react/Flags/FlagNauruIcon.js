import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagNauruIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#012169', d: 'M0 9h24v5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#FFC72C', d: 'M24 7H0v2h24z' }),
    React.createElement("path", { fill: '#012169', d: 'M2 0h20a2 2 0 0 1 2 2v5H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'm7.781 13.645-.943-.944-.3 1.299-.344-1.287-.913.972.347-1.287-1.273.386.944-.944L4 11.537l1.287-.343-.972-.91 1.287.344-.39-1.273.945.944L6.46 9l.343 1.287.91-.972-.343 1.287 1.272-.386-.943.944 1.298.3-1.287.343.972.915-1.287-.348z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagNauruIcon);
export default ForwardRef;
