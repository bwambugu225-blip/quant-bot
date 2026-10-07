import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacySettlementFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 16, height: 16, rx: 8 }),
    React.createElement("path", { d: 'M8 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2M4 7a1 1 0 1 1 0 2 1 1 0 0 1 0-2m8 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2' })));
const ForwardRef = forwardRef(LegacySettlementFillIcon);
export default ForwardRef;
