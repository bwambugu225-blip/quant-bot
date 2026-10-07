import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSixBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M20.375 19c0-2.383-1.992-4.375-4.375-4.375a4.3 4.3 0 0 0-3.203 1.406l-.195.235c-.665.78-.977 1.757-.977 2.734A4.37 4.37 0 0 0 16 23.375c2.383 0 4.375-1.953 4.375-4.375m-4.96-6.21c.194 0 .39-.04.585-.04 3.438 0 6.25 2.813 6.25 6.25A6.243 6.243 0 0 1 16 25.25 6.22 6.22 0 0 1 9.75 19c0-1.602.586-3.086 1.602-4.18l5.468-6.718a.93.93 0 0 1 1.328-.118c.391.313.47.899.118 1.329z' })));
const ForwardRef = forwardRef(StandaloneSixBoldIcon);
export default ForwardRef;
