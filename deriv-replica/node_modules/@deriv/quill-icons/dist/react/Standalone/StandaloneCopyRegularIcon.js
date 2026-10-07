import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCopyRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.25 20.25c.664 0 1.25-.547 1.25-1.25v-7.969a.63.63 0 0 0-.195-.43l-2.657-2.656a.63.63 0 0 0-.43-.195H16c-.703 0-1.25.586-1.25 1.25v10c0 .703.547 1.25 1.25 1.25zm1.914-10.547c.352.352.586.86.586 1.328V19c0 1.406-1.133 2.5-2.5 2.5H16a2.47 2.47 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h4.219c.468 0 .976.234 1.328.586zM9.75 11.5h2.5v1.25h-2.5c-.703 0-1.25.586-1.25 1.25v10c0 .703.547 1.25 1.25 1.25H16c.664 0 1.25-.547 1.25-1.25v-1.25h1.25V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5V14c0-1.367 1.094-2.5 2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneCopyRegularIcon);
export default ForwardRef;
