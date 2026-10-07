import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesSpreadsPutIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M12 24v2.667H5.334V24zm9.172-14.6 4.714 4.715q.241.248.412.552c.492.82.492 1.846 0 2.666h-7.08l-2.666-2.666h6.115l-1.504-1.504a2.65 2.65 0 0 1 0-3.754zm5.495-4.067V8H5.334V5.333z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M21.334 20v2.115l-7.448-7.448H5.334v2.666h7.448L19.447 24H17.32a2.653 2.653 0 0 0-2.653 2.653v.014h6.667A2.667 2.667 0 0 0 24 24v-4z' })));
const ForwardRef = forwardRef(TradeTypesSpreadsPutIcon);
export default ForwardRef;
