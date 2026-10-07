import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSouthAfricaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#F44E46', d: 'M2 0C1.498 0 1.039.185.687.491L7 5h17V2a2 2 0 0 0-2-2z' }),
    React.createElement("path", { fill: '#072CB4', d: 'M2 16c-.502 0-.961-.185-1.313-.491L7 11h17v3a2 2 0 0 1-2 2z' }),
    React.createElement("path", { fill: '#fff', d: 'M.687 15.509A2 2 0 0 1 0 14v-2l6-4-6-4V2C0 1.398.266.858.687.491L7 5h17v6H7z' }),
    React.createElement("path", { fill: '#06A86E', d: 'M0 4V2c0-.308.07-.6.194-.861L7 6h17v4H7L.194 14.861A2 2 0 0 1 0 14v-2l6-4z' }),
    React.createElement("path", { fill: '#FFBF2E', d: 'M6 8 0 4v1.5L4 8l-4 2.5V12z' }),
    React.createElement("path", { fill: '#333', d: 'M0 5.5 4 8l-4 2.5z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagSouthAfricaIcon);
export default ForwardRef;
