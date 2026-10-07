import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleSortRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.75 16.5c0-3.125-1.68-5.977-4.375-7.54-2.734-1.6-6.055-1.6-8.75 0A8.63 8.63 0 0 0 7.25 16.5c0 3.164 1.64 6.016 4.375 7.578 2.695 1.602 6.016 1.602 8.75 0A8.73 8.73 0 0 0 24.75 16.5M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m9.531-6.055a.66.66 0 0 1 .899 0l3.75 3.75c.156.196.234.47.117.703-.078.196-.313.352-.547.352h-7.5c-.273 0-.508-.117-.586-.352-.117-.234-.039-.507.117-.703zM13.734 14h4.493L16 11.773zm-1.953 4.844c-.156-.196-.234-.469-.117-.703.078-.235.313-.391.586-.391h7.5c.234 0 .469.156.547.39.117.235.039.508-.117.704l-3.75 3.75a.66.66 0 0 1-.899 0zM16 21.266 18.227 19h-4.493z' })));
const ForwardRef = forwardRef(StandaloneCircleSortRegularIcon);
export default ForwardRef;
