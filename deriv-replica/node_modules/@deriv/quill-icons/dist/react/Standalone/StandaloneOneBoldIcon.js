import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneOneBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.938 8.688v14.687h3.125a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-8.125c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h3.124V10.367l-2.656 1.64c-.43.274-1.015.118-1.289-.312-.273-.43-.117-1.015.313-1.289l4.062-2.5a.9.9 0 0 1 .938-.039c.312.196.508.508.508.82' })));
const ForwardRef = forwardRef(StandaloneOneBoldIcon);
export default ForwardRef;
