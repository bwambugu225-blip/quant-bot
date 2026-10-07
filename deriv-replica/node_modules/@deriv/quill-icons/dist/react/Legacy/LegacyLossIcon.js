import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyLossIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, fill: '#EC3F3F', rx: 8 }),
    React.createElement("path", { fill: '#fff', fillRule: 'evenodd', d: 'M5.146 5.146a.5.5 0 0 1 .708 0L8 7.293l2.146-2.147a.5.5 0 0 1 .638-.057l.07.057a.5.5 0 0 1 0 .708L8.707 8l2.147 2.146a.5.5 0 0 1 .057.638l-.057.07a.5.5 0 0 1-.708 0L8 8.707l-2.146 2.147a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708L7.293 8 5.146 5.854a.5.5 0 0 1-.057-.638z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyLossIcon);
export default ForwardRef;
