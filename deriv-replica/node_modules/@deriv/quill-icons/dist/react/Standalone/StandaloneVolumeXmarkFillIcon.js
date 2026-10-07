import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneVolumeXmarkFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.508 7.867c.43.196.742.664.742 1.133v15c0 .508-.312.938-.742 1.172a1.26 1.26 0 0 1-1.367-.235L9.867 20.25H7.25a2.47 2.47 0 0 1-2.5-2.5v-2.5c0-1.367 1.094-2.5 2.5-2.5h2.617l5.274-4.648c.39-.352.898-.43 1.367-.235m4.844 5.156 2.148 2.149 2.148-2.149a.92.92 0 0 1 1.29 0c.39.391.39.977 0 1.329L24.789 16.5l2.148 2.148c.391.391.391.977 0 1.329a.856.856 0 0 1-1.289 0L23.5 17.828l-2.148 2.149c-.391.39-.977.39-1.329 0-.39-.352-.39-.938 0-1.329l2.149-2.148-2.149-2.148c-.39-.352-.39-.938 0-1.329.352-.351.938-.351 1.329 0' })));
const ForwardRef = forwardRef(StandaloneVolumeXmarkFillIcon);
export default ForwardRef;
