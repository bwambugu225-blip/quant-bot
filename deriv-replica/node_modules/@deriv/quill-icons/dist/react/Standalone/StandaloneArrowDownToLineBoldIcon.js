import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowDownToLineBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.563 25.25H9.438c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h13.125a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937m-7.266-5.273-5-5.313a.97.97 0 0 1 .039-1.328c.39-.352.976-.352 1.328.039l3.399 3.594V8.687c0-.507.39-.937.937-.937a.95.95 0 0 1 .938.938v8.28l3.359-3.593c.351-.39.937-.39 1.328-.04.39.352.39.938.04 1.33l-5 5.312a.92.92 0 0 1-.665.273c-.273 0-.508-.078-.703-.273' })));
const ForwardRef = forwardRef(StandaloneArrowDownToLineBoldIcon);
export default ForwardRef;
