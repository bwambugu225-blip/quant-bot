import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCaretUpFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.86 11.89 5 5c.35.352.468.9.273 1.368s-.664.781-1.133.781H11a1.28 1.28 0 0 1-1.172-.781 1.26 1.26 0 0 1 .274-1.367l5-5a1.205 1.205 0 0 1 1.757 0' })));
const ForwardRef = forwardRef(StandaloneCaretUpFillIcon);
export default ForwardRef;
