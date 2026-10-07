import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMicrophoneRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M18.5 10.25c0-1.367-1.133-2.5-2.5-2.5a2.49 2.49 0 0 0-2.5 2.5v6.25c0 1.406 1.094 2.5 2.5 2.5 1.367 0 2.5-1.094 2.5-2.5zm-6.25 0a3.751 3.751 0 0 1 7.5 0v6.25a3.751 3.751 0 0 1-7.5 0zM11 14.625V16.5c0 2.773 2.227 5 5 5 2.734 0 5-2.227 5-5v-1.875c0-.312.273-.625.625-.625.313 0 .625.313.625.625V16.5c0 3.242-2.5 5.938-5.625 6.25v2.5h2.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-6.25a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h2.5v-2.5c-3.164-.312-5.625-3.008-5.625-6.25v-1.875c0-.312.273-.625.625-.625.313 0 .625.313.625.625' })));
const ForwardRef = forwardRef(StandaloneMicrophoneRegularIcon);
export default ForwardRef;
