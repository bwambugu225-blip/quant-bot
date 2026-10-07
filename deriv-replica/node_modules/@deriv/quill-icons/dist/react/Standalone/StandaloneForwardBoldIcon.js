import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneForwardBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.75 10.172c0-.625.508-1.172 1.172-1.172.234 0 .469.078.664.234l9.023 6.524c.235.195.391.469.391.742 0 .313-.156.586-.39.781l-9.024 6.524c-.195.117-.43.195-.664.195a1.15 1.15 0 0 1-1.172-1.172v-3.867l-6.914 4.844c-.195.156-.43.195-.664.195A1.15 1.15 0 0 1 6 22.828V10.211C6 9.547 6.508 9 7.172 9c.234 0 .469.078.664.234l6.914 4.844zm0 6.172-6.875-4.805V21.5l6.875-4.805zm8.71.156-6.835-4.922v9.883z' })));
const ForwardRef = forwardRef(StandaloneForwardBoldIcon);
export default ForwardRef;
