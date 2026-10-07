import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneNineFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.25 14c0 1.367.703 2.578 1.875 3.281 1.133.664 2.578.664 3.75 0 1.133-.703 1.875-1.914 1.875-3.281 0-1.328-.742-2.54-1.875-3.242-1.172-.664-2.617-.664-3.75 0-1.172.703-1.875 1.914-1.875 3.242m3.398 6.25c-3.28-.156-5.898-2.89-5.898-6.25A6.243 6.243 0 0 1 16 7.75c3.438 0 6.25 2.813 6.25 6.25 0 .117-.04.234-.04.313-.038 1.406-.585 2.734-1.483 3.828l-5.664 6.68c-.43.546-1.25.585-1.758.156-.547-.43-.586-1.25-.157-1.758z' })));
const ForwardRef = forwardRef(StandaloneNineFillIcon);
export default ForwardRef;
