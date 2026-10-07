import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSixFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm18.813 9.82-2.5 2.97c3.28.155 5.937 2.89 5.937 6.21A6.243 6.243 0 0 1 16 25.25 6.22 6.22 0 0 1 9.75 19v-.156c.04-1.446.547-2.852 1.484-3.946l5.664-6.68c.43-.546 1.25-.585 1.758-.155.547.43.586 1.25.157 1.757M19.75 19c0-1.328-.742-2.54-1.875-3.242-1.172-.664-2.617-.664-3.75 0-1.172.703-1.875 1.914-1.875 3.242 0 1.367.703 2.578 1.875 3.281 1.133.664 2.578.664 3.75 0 1.133-.703 1.875-1.914 1.875-3.281' })));
const ForwardRef = forwardRef(StandaloneSixFillIcon);
export default ForwardRef;
