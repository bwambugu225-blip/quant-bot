import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.297 24.977-6.563-6.875c-.351-.391-.351-.977.04-1.329.39-.351.976-.351 1.328.04l4.96 5.195V8.688c0-.508.391-.938.938-.938a.95.95 0 0 1 .938.938v13.32l4.921-5.195a.93.93 0 0 1 1.328-.04c.391.352.391.938.04 1.329l-6.563 6.875a.92.92 0 0 1-.664.273c-.273 0-.508-.078-.703-.273' })));
const ForwardRef = forwardRef(StandaloneArrowDownBoldIcon);
export default ForwardRef;
