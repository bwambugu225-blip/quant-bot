import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCheckFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m4.414-11.836h-.039c.39-.351.39-.937 0-1.328a.92.92 0 0 0-1.29 0L14.75 17.71l-1.836-1.836c-.39-.39-.976-.39-1.328 0a.856.856 0 0 0 0 1.29l2.5 2.5c.351.39.937.39 1.328 0z' })));
const ForwardRef = forwardRef(StandaloneCircleCheckFillIcon);
export default ForwardRef;
