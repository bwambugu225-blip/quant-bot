import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTwoFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.297 10.25c-.82 0-1.64.352-2.227.938l-1.21 1.21a1.205 1.205 0 0 1-1.758 0 1.204 1.204 0 0 1 0-1.757l1.21-1.211c1.055-1.055 2.5-1.68 3.985-1.68A5.685 5.685 0 0 1 21 13.453c0 1.485-.625 2.93-1.68 3.985l-5.312 5.312H21c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11c-.508 0-.977-.273-1.172-.742a1.26 1.26 0 0 1 .274-1.367l7.46-7.461a3.2 3.2 0 0 0 .938-2.227 3.22 3.22 0 0 0-3.203-3.203' })));
const ForwardRef = forwardRef(StandaloneTwoFillIcon);
export default ForwardRef;
