import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWindowMinimizeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 22.75h17.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H7.25C6.547 25.25 6 24.703 6 24c0-.664.547-1.25 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneWindowMinimizeFillIcon);
export default ForwardRef;
