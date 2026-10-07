import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowsRotateFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.102 14.43c-.235.664-.977 1.015-1.602.78a1.25 1.25 0 0 1-.781-1.6 8.8 8.8 0 0 1 2.07-3.282 8.794 8.794 0 0 1 12.383 0l.664.703V9.625c0-.664.586-1.25 1.25-1.25.703 0 1.25.586 1.25 1.25V14c0 .703-.547 1.25-1.25 1.25H19.75c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h1.328l-.664-.664a6.32 6.32 0 0 0-8.867 0c-.664.703-1.172 1.484-1.445 2.344m-2.579 3.398c.04-.039.118-.039.157-.039.078 0 .117-.039.195-.039h4.375c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-1.367l.664.703a6.32 6.32 0 0 0 8.867 0c.664-.703 1.172-1.484 1.445-2.344.235-.664.977-1.015 1.602-.78a1.25 1.25 0 0 1 .781 1.6c-.43 1.212-1.133 2.305-2.07 3.282a8.794 8.794 0 0 1-12.383 0l-.664-.703v1.367c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-4.531c0-.078 0-.117.04-.157.038-.195.155-.39.312-.546.156-.157.351-.274.546-.313' })));
const ForwardRef = forwardRef(StandaloneArrowsRotateFillIcon);
export default ForwardRef;
