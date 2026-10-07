import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyOhlcIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#85ACB0', d: 'M7 2a1 1 0 0 1 1 1v2h3a1 1 0 0 1 .993.883L12 6a1 1 0 0 1-1 1H8v12a1 1 0 0 1-.883.993L7 20a1 1 0 0 1-1-1v-5H3a1 1 0 0 1-.993-.883L2 13a1 1 0 0 1 1-1h3V3a1 1 0 0 1 .883-.993z' }),
    React.createElement("path", { fill: '#FF444F', d: 'M17 5a1 1 0 0 1 1 1v12h3a1 1 0 0 1 .993.883L22 19a1 1 0 0 1-1 1h-3v1a1 1 0 0 1-.883.993L17 22a1 1 0 0 1-1-1v-9h-5a1 1 0 1 1 0-2h5V6a1 1 0 0 1 1-1' })));
const ForwardRef = forwardRef(LegacyOhlcIcon);
export default ForwardRef;
