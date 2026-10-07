import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneClapperboardPlayBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.875 22.75c0 .352.273.625.625.625h15a.64.64 0 0 0 .625-.625v-8.125H7.875zm11.25-10h2.5l2.5-2.5c0-.312-.312-.625-.625-.625h-1.25zm-3.75 0L18.5 9.625H16l-3.125 3.125zm-6.25 0 3.125-3.125h-2.5L7.875 11.5v1.25zM26 10.25v12.5c0 1.406-1.133 2.5-2.5 2.5h-15a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5h15c1.367 0 2.5 1.133 2.5 2.5m-11.562 5.703c.195-.078.468-.078.624.04l3.75 2.5a.61.61 0 0 1 .313.507c0 .234-.117.43-.312.547l-3.75 2.5c-.157.117-.43.117-.626.039a.69.69 0 0 1-.312-.586v-5c0-.195.117-.43.313-.547' })));
const ForwardRef = forwardRef(StandaloneClapperboardPlayBoldIcon);
export default ForwardRef;
