import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBullhornBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm22.875 9.39-.43.43a12.15 12.15 0 0 1-8.32 3.555v5.04c3.125.038 6.094 1.327 8.32 3.554l.43.43zM12.25 11.5h1.563c2.734 0 5.351-1.055 7.304-3.008l1.485-1.484c.78-.781 2.148-.235 2.148.898v5.625c.703.352 1.25 1.29 1.25 2.344 0 1.094-.547 2.031-1.25 2.383v5.625c0 1.133-1.367 1.68-2.148.898l-1.485-1.484c-1.875-1.875-4.375-2.969-6.992-3.008v4.023c0 1.211-1.016 2.188-2.187 2.188h-1.25A2.184 2.184 0 0 1 8.5 24.313V20.25a2.47 2.47 0 0 1-2.5-2.5V14c0-1.367 1.094-2.5 2.5-2.5zm-1.875 8.75v4.063c0 .195.117.312.313.312h1.25a.31.31 0 0 0 .312-.312V20.25zM8.5 13.375a.64.64 0 0 0-.625.625v3.75c0 .352.273.625.625.625h3.75v-5z' })));
const ForwardRef = forwardRef(StandaloneBullhornBoldIcon);
export default ForwardRef;
