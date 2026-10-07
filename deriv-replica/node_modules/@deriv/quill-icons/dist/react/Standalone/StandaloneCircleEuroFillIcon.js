import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleEuroFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-5-9.375a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h.938a4.97 4.97 0 0 0 4.648 3.203h1.64a.95.95 0 0 0 .938-.937.95.95 0 0 0-.937-.938h-1.641c-1.055 0-1.953-.508-2.54-1.328h3.204a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625H13.5c-.04-.156-.04-.39-.04-.586 0-.234 0-.43.04-.664h3.75a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-3.164c.586-.742 1.484-1.25 2.5-1.25h1.64c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938h-1.641c-2.07 0-3.906 1.328-4.648 3.125H11a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h.625c-.04.234-.04.469-.04.664s0 .39.04.586z' })));
const ForwardRef = forwardRef(StandaloneCircleEuroFillIcon);
export default ForwardRef;
