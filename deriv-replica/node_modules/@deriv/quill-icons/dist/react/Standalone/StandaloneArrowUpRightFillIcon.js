import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 11.5v8.75c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-5.703l-7.89 7.851a1.205 1.205 0 0 1-1.758 0 1.204 1.204 0 0 1 0-1.757l7.851-7.891H12.25c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25H21c.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneArrowUpRightFillIcon);
export default ForwardRef;
