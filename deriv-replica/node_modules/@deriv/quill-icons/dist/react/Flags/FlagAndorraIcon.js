import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagAndorraIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#D20636', d: 'M16 0h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6z' }),
    React.createElement("path", { fill: '#FFE100', d: 'M16 0H8v16h8z' }),
    React.createElement("path", { fill: '#0006AB', d: 'M2 0h6v16H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#C8B47C', fillRule: 'evenodd', d: 'M13.436 10.435A1.5 1.5 0 0 0 14.5 9V6c0-.835-.672-1.5-1.5-1.5h-2A1.5 1.5 0 0 0 9.5 6v3c0 .682.448 1.25 1.064 1.436.186.62.758 1.064 1.436 1.064.682 0 1.25-.45 1.436-1.065', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#D20636', fillRule: 'evenodd', d: 'M10.5 5.5h1V7h-1zm2 2h1V9h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#FFE100', fillRule: 'evenodd', d: 'M12.5 5.5h1V7h-1zm-2 2h1V9h-1z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagAndorraIcon);
export default ForwardRef;
