import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChartLineUpDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6.938 7.75a.95.95 0 0 1 .937.938v13.75c0 .546.39.937.938.937h16.25a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H8.813A2.8 2.8 0 0 1 6 22.438V8.688c0-.508.39-.938.938-.938m13.75 3.125c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h3.125c.234 0 .468.117.664.273.156.196.273.43.273.665v3.124c0 .547-.43.938-.937.938-.547 0-.938-.39-.938-.937v-.86l-4.96 4.961c-.392.39-.977.39-1.33 0l-2.46-2.46-2.46 2.46c-.392.39-.977.39-1.33 0a.856.856 0 0 1 0-1.289l3.126-3.125c.351-.39.937-.39 1.328 0l2.461 2.46 4.297-4.335zm0 10.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h.859l-1.836-1.836 1.328-1.328 1.836 1.836v-.86c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938v3.125a.94.94 0 0 1-.273.664.92.92 0 0 1-.665.273z' })));
const ForwardRef = forwardRef(StandaloneChartLineUpDownBoldIcon);
export default ForwardRef;
