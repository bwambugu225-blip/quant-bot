import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneShieldCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.508 6.617 7.344 3.125c.859.39 1.523 1.211 1.523 2.227-.04 3.906-1.64 10.976-8.36 14.219a2.4 2.4 0 0 1-2.07 0c-6.718-3.243-8.32-10.313-8.32-14.22-.04-1.015.625-1.835 1.484-2.226l7.344-3.125a1.25 1.25 0 0 1 1.055 0m1.68 8.008c0-1.172-1.016-2.187-2.188-2.187-1.21 0-2.187 1.015-2.187 2.187 0 .898.507 1.64 1.25 1.992v2.695c0 .547.39.938.937.938.508 0 .938-.39.938-.937v-2.696c.703-.351 1.25-1.094 1.25-1.992' })));
const ForwardRef = forwardRef(StandaloneShieldCheckFillIcon);
export default ForwardRef;
