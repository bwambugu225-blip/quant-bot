import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagJamaicaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#009C34', d: 'M.774.42C1.113.156 1.538 0 2 0h20c.462 0 .887.157 1.226.42L12 6.5zM2 16c-.462 0-.887-.156-1.226-.42L12 9.5l11.226 6.08c-.339.264-.764.42-1.226.42z' }),
    React.createElement("path", { fill: '#000', d: 'M9.5 8 0 3v10z' }),
    React.createElement("path", { fill: '#F9D905', fillRule: 'evenodd', d: 'M23.226.42 12 6.5.774.42A2 2 0 0 0 0 2v1l9.5 5L0 13v1c0 .643.303 1.215.774 1.58L12 9.5l11.226 6.08c.47-.365.774-.937.774-1.58V2c0-.643-.303-1.215-.774-1.58M24 3l-9.5 5 9.496 5z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', d: 'M14.5 8 24 3l-.004 10z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagJamaicaIcon);
export default ForwardRef;
