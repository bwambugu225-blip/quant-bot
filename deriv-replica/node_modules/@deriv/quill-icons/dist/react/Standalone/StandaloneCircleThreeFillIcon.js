import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleThreeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-2.812-15a.925.925 0 0 0-.938.938c0 .546.39.937.938.937h2.578l-1.993 1.836a.9.9 0 0 0-.234 1.016.99.99 0 0 0 .899.585h1.992a1.4 1.4 0 0 1 1.406 1.407 1.4 1.4 0 0 1-1.406 1.406h-1.094c-.508 0-.977-.234-1.29-.703l-.077-.156c-.274-.43-.86-.586-1.29-.313-.429.274-.585.86-.312 1.29l.117.155c.586 1.016 1.68 1.602 2.891 1.602h1.055c1.836 0 3.32-1.445 3.32-3.281 0-1.68-1.29-3.086-2.93-3.242l1.992-1.836c.274-.274.391-.664.235-1.016s-.508-.625-.86-.625z' })));
const ForwardRef = forwardRef(StandaloneCircleThreeFillIcon);
export default ForwardRef;
