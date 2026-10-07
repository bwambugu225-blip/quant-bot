import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartLineBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.875 8.688v13.75c0 .546.39.937.938.937h16.25a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H8.813A2.8 2.8 0 0 1 6 22.438V8.688c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938m16.602 4.414-5.352 5.312a.856.856 0 0 1-1.29 0l-3.085-3.086-3.086 3.086c-.39.39-.976.39-1.328 0a.856.856 0 0 1 0-1.289l3.75-3.75c.156-.195.39-.273.664-.273.234 0 .469.078.664.273l3.086 3.086 4.648-4.648c.352-.391.938-.391 1.329 0a.92.92 0 0 1 0 1.289' })));
const ForwardRef = forwardRef(StandaloneChartLineBoldIcon);
export default ForwardRef;
