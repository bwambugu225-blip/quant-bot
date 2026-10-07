import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowDownBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 8.375c-2.93 0-5.586 1.563-7.07 4.063-1.446 2.539-1.446 5.624 0 8.124A8.13 8.13 0 0 0 16 24.626c2.89 0 5.547-1.523 7.031-4.062 1.446-2.5 1.446-5.586 0-8.125-1.484-2.5-4.14-4.063-7.031-4.063M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m4.102-8.71-3.438 3.437c-.39.39-.977.39-1.328 0l-3.438-3.438a.856.856 0 0 1 0-1.289c.352-.39.938-.39 1.329 0l1.835 1.836v-5.898c0-.508.391-.938.938-.938a.95.95 0 0 1 .938.938v5.898l1.835-1.836a.856.856 0 0 1 1.29 0c.39.352.39.938 0 1.29z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowDownBoldIcon);
export default ForwardRef;
