import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCaretUpRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 7.75a8.73 8.73 0 0 0-7.578 4.375c-1.602 2.734-1.602 6.055 0 8.75C9.984 23.609 12.836 25.25 16 25.25a8.63 8.63 0 0 0 7.54-4.375c1.6-2.695 1.6-6.016 0-8.75C21.976 9.43 19.124 7.75 16 7.75m0 18.75c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m0-13.75c.352 0 .703.156.977.43l3.71 4.023c.196.195.313.469.313.742 0 .586-.508 1.055-1.094 1.055h-7.851A1.05 1.05 0 0 1 11 17.945c0-.273.078-.547.273-.742l3.711-4.023c.274-.274.625-.43 1.016-.43m-.078 1.29-3.477 3.71h7.07l-3.476-3.71L16 14c-.04 0-.078.04-.078.04' })));
const ForwardRef = forwardRef(StandaloneCircleCaretUpRegularIcon);
export default ForwardRef;
