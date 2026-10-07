import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBookmark1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.5 1h-7A1.5 1.5 0 0 0 3 2.5v12l.007.084a.5.5 0 0 0 .825.29L8 11.169l4.168 3.705A.5.5 0 0 0 13 14.5v-12A1.5 1.5 0 0 0 11.5 1m0 1 .09.008A.5.5 0 0 1 12 2.5v10.886l-3.668-3.26-.075-.055a.5.5 0 0 0-.59.055L4 13.386V2.5a.5.5 0 0 1 .5-.5z' })));
const ForwardRef = forwardRef(LegacyBookmark1pxIcon);
export default ForwardRef;
