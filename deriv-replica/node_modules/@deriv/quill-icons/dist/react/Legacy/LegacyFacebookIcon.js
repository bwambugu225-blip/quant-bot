import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyFacebookIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 17', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m1.25-5.625v5.528a8 8 0 0 1-2.5 0v-5.528H4.719V8.05H6.75V6.275c0-2.017 1.194-3.131 3.022-3.131.875 0 1.79.157 1.79.157v1.98h-1.008c-.994 0-1.304.621-1.304 1.258v1.51h2.219l-.355 2.326z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyFacebookIcon);
export default ForwardRef;
