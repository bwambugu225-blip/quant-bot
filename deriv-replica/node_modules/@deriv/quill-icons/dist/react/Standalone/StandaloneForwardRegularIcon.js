import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneForwardRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.516 16.5 16 10.328v12.383zM15.922 9c.234 0 .469.078.664.234l9.023 6.524c.235.195.391.469.391.742 0 .313-.156.586-.39.781l-9.024 6.524c-.195.117-.43.195-.664.195a1.15 1.15 0 0 1-1.172-1.172v-4.023l-6.914 5c-.195.117-.43.195-.664.195A1.15 1.15 0 0 1 6 22.828V10.172C6 9.547 6.508 9 7.172 9c.234 0 .469.078.664.234l6.914 5v-4.062c0-.625.508-1.172 1.172-1.172m-1.172 8.281v-1.523l-7.5-5.43v12.383z' })));
const ForwardRef = forwardRef(StandaloneForwardRegularIcon);
export default ForwardRef;
