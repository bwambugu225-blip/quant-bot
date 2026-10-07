import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const MarketIndicesGerman40Icon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FFCD00', d: 'M4 19h24v3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z' }),
    React.createElement("path", { fill: '#F10000', d: 'M28 13H4v6h24z' }),
    React.createElement("path", { fill: '#333', d: 'M6 8h20a2 2 0 0 1 2 2v3H4v-3a2 2 0 0 1 2-2' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M26 9H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V10a1 1 0 0 0-1-1M6 8a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#414652', d: 'M28.064 6.728q-.184.352-.664.352t-.664-.352-.184-.992V4.68q0-.64.184-.992t.664-.352.664.352.184.992v1.056q0 .64-.184.992M22.9 6h-1.497l1.416-2.344h.08z' }),
    React.createElement("path", { fill: '#414652', fillRule: 'evenodd', d: 'M20 0a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm5.776 7.336q.528.76 1.624.76t1.624-.76.528-2.128-.528-2.128-1.624-.76-1.624.76-.528 2.128.528 2.128m-2.877-.408V8h1.144V6.928h.704V6h-.704V2.416H22.62l-2.176 3.488v1.024z', clipRule: 'evenodd' }),
    React.createElement("path", { fill: '#fff', d: 'M27.4 8.096q-1.096 0-1.624-.76t-.528-2.128.528-2.128 1.624-.76 1.624.76.528 2.128-.528 2.128-1.624.76m0-1.016q.48 0 .664-.352t.184-.992V4.68q0-.64-.184-.992t-.664-.352-.664.352-.184.992v1.056q0 .64.184.992t.664.352M22.9 8V6.928h-2.457V5.904l2.176-3.488h1.424V6h.704v.928h-.704V8zm-1.497-2H22.9V3.656h-.08z' })));
const ForwardRef = forwardRef(MarketIndicesGerman40Icon);
export default ForwardRef;
