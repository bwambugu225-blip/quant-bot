import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleFiveFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-1.875-15h-.04c-.429 0-.82.352-.898.781l-.624 3.438a1 1 0 0 0 .156.742c.156.195.39.312.664.352l3.398.39c.625.078 1.094.586 1.094 1.211 0 .664-.547 1.211-1.25 1.211h-1.406c-.43 0-.86-.195-1.133-.586l-.156-.234a.94.94 0 0 0-1.29-.274c-.43.313-.546.899-.234 1.328l.156.235c.586.898 1.602 1.406 2.657 1.406h1.406c1.719 0 3.125-1.367 3.125-3.086 0-1.562-1.21-2.89-2.773-3.086l-2.383-.273.312-1.68h3.281c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938z' })));
const ForwardRef = forwardRef(StandaloneCircleFiveFillIcon);
export default ForwardRef;
