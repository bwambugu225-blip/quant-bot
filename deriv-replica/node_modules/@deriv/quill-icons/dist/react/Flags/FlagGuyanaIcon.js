import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagGuyanaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#000', fillRule: 'evenodd', d: 'M0 2v12.017a2 2 0 0 0 .383 1.16l.016.022.017.023a2 2 0 0 0 .084.1l.012.014a2 2 0 0 0 .109.112l1.276-1.135L9 8 1.897 1.687.621.552a2 2 0 0 0-.568.99v.002l-.005.019A2 2 0 0 0 0 2m7.495 6L1 2.227v11.546z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#CD1127', d: 'M1 2.227 7.495 8 1 13.773z' }),
    React.createElement("path", { fill: '#FED116', d: 'M1.897 1.687 9 8l-7.103 6.313L20.837 8z' }),
    React.createElement("path", { fill: '#fff', d: 'M24 8 .93.31a2 2 0 0 0-.31.242l1.277 1.135L20.837 8l-18.94 6.313-1.276 1.135a2 2 0 0 0 .309.242z' }),
    React.createElement("path", { fill: '#019E49', d: 'M24 14V8L.93 15.69A2 2 0 0 0 2 16h20a2 2 0 0 0 2-2' }),
    React.createElement("path", { fill: '#000', fillRule: 'evenodd', d: 'm.383 15.177.033.045-.017-.023zm.057.074.06.072.012.013a2 2 0 0 0 .109.112z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#019E49', d: 'M22 0H2A2 2 0 0 0 .93.31L24 8V2a2 2 0 0 0-2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagGuyanaIcon);
export default ForwardRef;
