import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.75 24V14h-4.375a1.85 1.85 0 0 1-1.875-1.875V7.75h-5c-.703 0-1.25.586-1.25 1.25v15c0 .703.547 1.25 1.25 1.25h10c.664 0 1.25-.547 1.25-1.25m-.04-11.25c-.038-.078-.077-.195-.155-.273l-4.532-4.532c-.078-.078-.195-.117-.273-.156v4.336c0 .352.273.625.625.625zM9 9c0-1.367 1.094-2.5 2.5-2.5h6.094c.468 0 .976.234 1.328.586l4.492 4.492c.352.352.586.86.586 1.328V24c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 9 24z' })));
const ForwardRef = forwardRef(StandaloneFileRegularIcon);
export default ForwardRef;
