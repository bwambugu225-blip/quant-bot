import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTrashRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.164 7.75a.61.61 0 0 0-.508.313L13.031 9h5.899l-.625-.937a.61.61 0 0 0-.508-.313zM20.375 9h3.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-.742l-.977 13.945c-.117 1.328-1.172 2.305-2.5 2.305h-7.851a2.51 2.51 0 0 1-2.5-2.305L8.578 10.25h-.703a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h3.711l1.016-1.602a1.84 1.84 0 0 1 1.562-.898h3.633c.625 0 1.25.352 1.601.898zm1.758 1.25H9.828l.977 13.867c.039.625.586 1.133 1.25 1.133h7.851c.664 0 1.211-.508 1.25-1.133z' })));
const ForwardRef = forwardRef(StandaloneTrashRegularIcon);
export default ForwardRef;
