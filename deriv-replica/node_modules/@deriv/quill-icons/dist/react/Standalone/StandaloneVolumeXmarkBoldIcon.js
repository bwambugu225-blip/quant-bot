import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneVolumeXmarkBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.96 14.39a.86.86 0 0 1-.585.235H6.938a.31.31 0 0 0-.313.313v3.124c0 .196.117.313.313.313h3.437c.195 0 .43.117.586.273l4.414 3.868V10.523zm5.118-6.64c.625 0 1.172.547 1.172 1.172v15.195c0 .625-.547 1.133-1.172 1.133-.312 0-.586-.078-.781-.273L9.984 20.25H6.938a2.184 2.184 0 0 1-2.188-2.187v-3.125c0-1.172.977-2.188 2.188-2.188h3.046l5.313-4.687a1.1 1.1 0 0 1 .781-.313m5.274 5.273 2.148 2.149 2.148-2.149a.92.92 0 0 1 1.29 0c.39.391.39.977 0 1.329L24.789 16.5l2.148 2.148c.391.391.391.977 0 1.329a.856.856 0 0 1-1.289 0L23.5 17.828l-2.148 2.149c-.391.39-.977.39-1.329 0-.39-.352-.39-.938 0-1.329l2.149-2.148-2.149-2.148c-.39-.352-.39-.938 0-1.329.352-.351.938-.351 1.329 0' })));
const ForwardRef = forwardRef(StandaloneVolumeXmarkBoldIcon);
export default ForwardRef;
