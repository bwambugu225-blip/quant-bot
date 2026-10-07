import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyTrendIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M12 2H2v2h4v8h2V4h4z' }),
    React.createElement("path", { fill: '#85ACB0', d: 'm5.747 21.664 16-18a1 1 0 0 0-1.494-1.328l-16 18a1 1 0 0 0 1.494 1.328' })));
const ForwardRef = forwardRef(LegacyTrendIcon);
export default ForwardRef;
