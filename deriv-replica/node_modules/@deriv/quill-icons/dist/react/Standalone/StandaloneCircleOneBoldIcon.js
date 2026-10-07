import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleOneBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10.469-4.844a.94.94 0 0 1 .468.781v7.188H18.5a.95.95 0 0 1 .938.938c0 .546-.43.937-.938.937h-5c-.547 0-.937-.39-.937-.937 0-.508.39-.938.937-.938h1.563v-5.547l-.82.43a.876.876 0 0 1-1.25-.352.876.876 0 0 1 .35-1.25l2.188-1.25c.274-.156.625-.156.938 0' })));
const ForwardRef = forwardRef(StandaloneCircleOneBoldIcon);
export default ForwardRef;
