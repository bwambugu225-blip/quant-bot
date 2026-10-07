import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneHouseBlankFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M27.21 16.5c0 .703-.585 1.25-1.25 1.25h-1.25l.04 6.25c0 1.406-1.094 2.54-2.5 2.54H9.75a2.49 2.49 0 0 1-2.5-2.5v-6.29H6c-.703 0-1.25-.547-1.25-1.25 0-.352.117-.664.39-.937l10-8.75c.274-.274.587-.313.86-.313s.586.078.82.273l9.961 8.79c.313.273.469.585.43.937' })));
const ForwardRef = forwardRef(StandaloneHouseBlankFillIcon);
export default ForwardRef;
