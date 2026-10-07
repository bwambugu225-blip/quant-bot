import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpLeftRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.375 10.25h8.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-7.266l10.196 10.195a.66.66 0 0 1 0 .899.66.66 0 0 1-.899 0L11 12.398v7.227a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-8.75c0-.312.273-.625.625-.625' })));
const ForwardRef = forwardRef(StandaloneArrowUpLeftRegularIcon);
export default ForwardRef;
