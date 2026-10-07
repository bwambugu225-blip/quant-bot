import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneInfoRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.75 9c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25m-1.875 4.375c0-.312.273-.625.625-.625H16c.313 0 .625.313.625.625V24h2.5c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-6.25a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h2.5V14H13.5a.617.617 0 0 1-.625-.625' })));
const ForwardRef = forwardRef(StandaloneInfoRegularIcon);
export default ForwardRef;
