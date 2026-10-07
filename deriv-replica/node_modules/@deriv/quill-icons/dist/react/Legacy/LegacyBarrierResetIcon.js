import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBarrierResetIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M1 8h2V7H1zm3 0h2V7H4zm3 0h2V7H7zm3 0h2V7h-2zm3 0h2V7h-2z' })));
const ForwardRef = forwardRef(LegacyBarrierResetIcon);
export default ForwardRef;
