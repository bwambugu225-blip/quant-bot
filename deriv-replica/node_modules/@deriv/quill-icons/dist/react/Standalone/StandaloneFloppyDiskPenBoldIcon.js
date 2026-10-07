import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFloppyDiskPenBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6.625 10.25v12.5c0 .352.273.625.625.625h8.047l-.469 1.875H7.25a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5h9.57c.664 0 1.29.273 1.758.742l2.93 2.93-1.328 1.328-2.93-2.93v-.039 3.906c0 .547-.43.938-.937.938h-7.5c-.547 0-.938-.39-.938-.937V9.625H7.25a.64.64 0 0 0-.625.625m14.883 1.172c.469.469.742 1.094.742 1.758v2.539l-1.875 1.875V13.18a.63.63 0 0 0-.195-.43zM9.75 9.625v3.125h5.625V9.625zM11 19c0-.86.469-1.68 1.25-2.148.742-.43 1.719-.43 2.5 0C15.492 17.32 16 18.14 16 19c0 .898-.508 1.719-1.25 2.188-.781.43-1.758.43-2.5 0A2.54 2.54 0 0 1 11 19m15.195-3.281.586.586c.586.586.586 1.601 0 2.187l-1.172 1.172-2.773-2.773 1.172-1.172c.586-.586 1.601-.586 2.187 0m-9.297 7.11 5.079-5.079 2.773 2.773-5.078 5.079a1.1 1.1 0 0 1-.547.312l-2.383.586c-.195.04-.43 0-.586-.156-.156-.157-.195-.39-.156-.586l.586-2.383c.039-.195.156-.39.312-.547' })));
const ForwardRef = forwardRef(StandaloneFloppyDiskPenBoldIcon);
export default ForwardRef;
