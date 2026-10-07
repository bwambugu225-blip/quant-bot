import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCommodityChannelIndexIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M16.126 2.514a1 1 0 0 1 1.742-.01l4 7a1 1 0 1 1-1.736.992l-3.12-5.459-9.138 16.449a1 1 0 0 1-1.655.139l-4-5a1 1 0 0 1 1.562-1.25l3.069 3.836zM12.75 3a1 1 0 1 1 0 2H3a1 1 0 1 1 0-2z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M21 19h-9.75a1 1 0 1 0 0 2H21a1 1 0 1 0 0-2' })));
const ForwardRef = forwardRef(LegacyCommodityChannelIndexIcon);
export default ForwardRef;
