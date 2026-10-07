import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleFiveBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 8.375c-2.93 0-5.586 1.563-7.07 4.063-1.446 2.539-1.446 5.624 0 8.124A8.13 8.13 0 0 0 16 24.626c2.89 0 5.547-1.523 7.031-4.062 1.446-2.5 1.446-5.586 0-8.125-1.484-2.5-4.14-4.063-7.031-4.063M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m-1.875-15h4.063a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-3.282l-.312 1.68 2.383.273c1.562.195 2.773 1.524 2.773 3.086a3.134 3.134 0 0 1-3.125 3.125h-1.406a3.2 3.2 0 0 1-2.656-1.445l-.157-.235a.897.897 0 0 1 .235-1.289.897.897 0 0 1 1.289.235l.195.234c.234.39.664.586 1.094.586h1.406c.703 0 1.25-.547 1.25-1.21 0-.626-.469-1.134-1.094-1.212l-3.398-.39c-.274 0-.508-.157-.664-.352-.156-.234-.196-.469-.156-.742l.624-3.438a.964.964 0 0 1 .938-.781' })));
const ForwardRef = forwardRef(StandaloneCircleFiveBoldIcon);
export default ForwardRef;
