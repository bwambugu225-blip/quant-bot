import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBackwardStepFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm20.18 23.727-7.5-6.25-.43-.391v5.664c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-12.5C9.75 9.586 10.297 9 11 9c.664 0 1.25.586 1.25 1.25v5.664l.43-.351 7.5-6.25c.39-.313.898-.391 1.328-.196.43.235.742.664.742 1.133v12.5c0 .508-.312.938-.742 1.133-.43.234-.938.156-1.328-.156' })));
const ForwardRef = forwardRef(StandaloneBackwardStepFillIcon);
export default ForwardRef;
