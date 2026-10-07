import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleFourRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m8.945-4.922c.352.117.508.469.352.781l-2.149 5.391h4.102v-3.125c0-.312.273-.625.625-.625.313 0 .625.313.625.625v3.125h.625c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625H18.5v1.875a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V19h-5c-.234 0-.43-.078-.547-.273a.55.55 0 0 1-.039-.547l2.5-6.25c.117-.352.469-.508.82-.352z' })));
const ForwardRef = forwardRef(StandaloneCircleFourRegularIcon);
export default ForwardRef;
