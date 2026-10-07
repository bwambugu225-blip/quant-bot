import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBarrierIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M1 8.5h14v-1H1z' })));
const ForwardRef = forwardRef(LegacyBarrierIcon);
export default ForwardRef;
