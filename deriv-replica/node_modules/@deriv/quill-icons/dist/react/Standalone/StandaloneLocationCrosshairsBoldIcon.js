import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLocationCrosshairsBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5a.95.95 0 0 1 .938.938v1.64c3.359.43 6.054 3.125 6.484 6.485h1.64A.95.95 0 0 1 26 16.5c0 .547-.43.938-.937.938h-1.641c-.43 3.398-3.125 6.093-6.485 6.523v1.602c0 .546-.43.937-.937.937-.547 0-.937-.39-.937-.937V23.96a7.545 7.545 0 0 1-6.524-6.523H6.938c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937h1.601c.43-3.36 3.125-6.055 6.524-6.485v-1.64c0-.508.39-.938.937-.938m-5.625 10a5.6 5.6 0 0 0 2.813 4.883c1.718 1.015 3.867 1.015 5.624 0 1.72-1.016 2.813-2.852 2.813-4.883 0-1.992-1.094-3.828-2.812-4.844-1.758-1.015-3.907-1.015-5.625 0a5.58 5.58 0 0 0-2.813 4.844m7.5 0c0-.664-.39-1.25-.937-1.602-.586-.351-1.329-.351-1.875 0-.586.352-.938.938-.938 1.602 0 .703.352 1.29.938 1.64.546.352 1.289.352 1.874 0 .547-.35.938-.937.938-1.64m-5.625 0c0-1.328.703-2.54 1.875-3.242 1.133-.664 2.578-.664 3.75 0 1.133.703 1.875 1.914 1.875 3.242 0 1.367-.742 2.578-1.875 3.281-1.172.664-2.617.664-3.75 0-1.172-.703-1.875-1.914-1.875-3.281' })));
const ForwardRef = forwardRef(StandaloneLocationCrosshairsBoldIcon);
export default ForwardRef;
