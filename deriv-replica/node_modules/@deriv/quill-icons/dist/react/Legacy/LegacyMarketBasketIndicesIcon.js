import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyMarketBasketIndicesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M8 1a.5.5 0 0 1 .41.213L11.76 6h3.74a.5.5 0 0 1 0 1h-.585l-1.424 7.592A.5.5 0 0 1 13 15H3a.5.5 0 0 1-.491-.408L1.085 7H.5a.5.5 0 0 1 0-1h3.74l3.35-4.787A.5.5 0 0 1 8 1M4.493 7h9.404l-1.312 7h-9.17L2.102 7zm6.047-1H5.46L8 2.372zM5.5 8a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5M8 8a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4A.5.5 0 0 1 8 8m2.5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 1 .5-.5', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyMarketBasketIndicesIcon);
export default ForwardRef;
