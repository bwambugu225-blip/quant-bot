import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneXmarkRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.156 22.594 16 17.398l-5.195 5.196c-.235.234-.625.234-.899 0-.234-.274-.234-.664 0-.899l5.196-5.195-5.196-5.156c-.234-.235-.234-.625 0-.899.274-.234.664-.234.899 0L16 15.641l5.156-5.196c.235-.234.625-.234.899 0 .234.274.234.664 0 .899L16.859 16.5l5.196 5.195c.234.235.234.625 0 .899-.274.234-.664.234-.899 0' })));
const ForwardRef = forwardRef(StandaloneXmarkRegularIcon);
export default ForwardRef;
