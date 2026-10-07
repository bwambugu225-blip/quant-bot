import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePaperclipRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M22.094 9.156a2.9 2.9 0 0 0-4.102 0l-7.5 7.5a4.645 4.645 0 0 0 0 6.602 4.645 4.645 0 0 0 6.602 0l5.937-5.938a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-5.938 5.937c-2.305 2.305-6.094 2.305-8.398 0-2.305-2.343-2.305-6.093 0-8.398l7.5-7.5a4.22 4.22 0 0 1 5.898 0 4.22 4.22 0 0 1 0 5.898l-7.187 7.188c-1.094 1.093-2.93.976-3.907-.235-.82-1.054-.742-2.539.196-3.476l5.937-5.938a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899l-5.938 5.937c-.508.469-.547 1.25-.117 1.797.508.625 1.484.703 2.031.117l7.188-7.187a2.9 2.9 0 0 0 0-4.102' })));
const ForwardRef = forwardRef(StandalonePaperclipRegularIcon);
export default ForwardRef;
