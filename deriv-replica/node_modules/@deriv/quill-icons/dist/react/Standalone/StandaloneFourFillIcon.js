import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFourFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.883 9.547-4.18 8.828H18.5V12.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v5.625h1.25c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H21V24c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-3.125H9.75c-.43 0-.86-.195-1.094-.547-.195-.39-.234-.82-.039-1.21l5-10.626c.274-.625 1.016-.898 1.64-.625.626.313.9 1.055.626 1.68' })));
const ForwardRef = forwardRef(StandaloneFourFillIcon);
export default ForwardRef;
