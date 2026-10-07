import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneHorizontalRuleFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 16.5c0-.664.547-1.25 1.25-1.25h22.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H4.75c-.703 0-1.25-.547-1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneHorizontalRuleFillIcon);
export default ForwardRef;
