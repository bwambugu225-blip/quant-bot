import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneHorizontalRuleBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.5 16.5c0-.508.39-.937.938-.937h23.125a.95.95 0 0 1 .937.937c0 .547-.43.938-.937.938H4.438c-.547 0-.938-.391-.938-.938' })));
const ForwardRef = forwardRef(StandaloneHorizontalRuleBoldIcon);
export default ForwardRef;
