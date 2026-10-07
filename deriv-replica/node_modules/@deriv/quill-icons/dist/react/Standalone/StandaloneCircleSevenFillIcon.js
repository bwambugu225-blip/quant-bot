import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleSevenFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-2.812-15v.04c-.547 0-.938.39-.938.937 0 .507.39.937.938.937h4.023l-3.633 6.719a.966.966 0 0 0 .39 1.289.966.966 0 0 0 1.29-.39l4.375-8.126a1 1 0 0 0-.04-.937.94.94 0 0 0-.78-.469z' })));
const ForwardRef = forwardRef(StandaloneCircleSevenFillIcon);
export default ForwardRef;
