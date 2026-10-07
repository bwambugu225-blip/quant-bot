import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWindowsIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 10.172v5.937h7.148V9.195zm0 12.695v-5.86h7.148v6.837zm7.93 1.094v-6.953h9.57v8.242zm0-14.883 9.57-1.328v8.36h-9.57z' })));
const ForwardRef = forwardRef(StandaloneWindowsIcon);
export default ForwardRef;
