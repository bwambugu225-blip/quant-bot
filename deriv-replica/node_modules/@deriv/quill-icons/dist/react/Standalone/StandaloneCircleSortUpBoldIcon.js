import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleSortUpBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.125 16.5c0-2.89-1.562-5.547-4.062-7.031-2.54-1.446-5.625-1.446-8.125 0-2.54 1.484-4.063 4.14-4.063 7.031a8.13 8.13 0 0 0 4.063 7.07c2.5 1.446 5.585 1.446 8.124 0 2.5-1.484 4.063-4.14 4.063-7.07M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10.43-6.055 3.75 3.75c.156.196.234.47.117.703-.078.196-.313.352-.547.352h-7.5c-.273 0-.508-.117-.586-.352-.117-.234-.039-.507.117-.703l3.75-3.75a.66.66 0 0 1 .899 0m0 12.149a.66.66 0 0 1-.899 0l-3.75-3.75c-.156-.196-.234-.469-.117-.703.078-.235.313-.391.586-.391h7.5c.234 0 .469.156.547.39.117.235.039.508-.117.704zM18.227 19h-4.493L16 21.266z' })));
const ForwardRef = forwardRef(StandaloneCircleSortUpBoldIcon);
export default ForwardRef;
