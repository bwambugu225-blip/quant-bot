import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagLiechtensteinIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#CE1126', d: 'M0 8h24v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#002B7F', d: 'M2 0h20a2 2 0 0 1 2 2v6H0V2a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#FFDA44', d: 'M7.347 4.542a1.091 1.091 0 0 0-1.817-.81v-.64h.363v-.73H5.53V2h-.728v.363h-.363v.728h.363v.641a1.091 1.091 0 0 0-1.455 1.627V6h3.634v-.64c.223-.2.363-.49.363-.818z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagLiechtensteinIcon);
export default ForwardRef;
