import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleSterlingFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m.195-13.75c.157 0 .313.04.43.117l1.21.469c.47.195 1.017-.04 1.212-.547a.935.935 0 0 0-.508-1.21l-1.21-.47a2.8 2.8 0 0 0-1.134-.234c-1.68 0-3.047 1.406-3.047 3.086v1.289h-.273a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h.273v.43c0 .625-.117 1.289-.43 1.875l-.39.703a1 1 0 0 0 .04.937c.155.274.468.43.82.43h5.624c.508 0 .938-.39.938-.937a.95.95 0 0 0-.937-.938h-4.141a6.3 6.3 0 0 0 .351-2.11v-.39h1.602a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-1.602v-1.29c0-.663.508-1.21 1.172-1.21' })));
const ForwardRef = forwardRef(StandaloneCircleSterlingFillIcon);
export default ForwardRef;
