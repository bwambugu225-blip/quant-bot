import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyArrowLeft1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14 8a.5.5 0 0 1-.5.5H3.708l2.646 2.647a.5.5 0 0 1 .057.638l-.057.069a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 0 1-.123-.202A.5.5 0 0 1 2 8l.005.072L2 8.021v-.02a.5.5 0 0 1 .077-.268q.03-.046.07-.086l-.045.051.033-.039.011-.012 3.5-3.5a.5.5 0 1 1 .708.707L3.708 7.5H13.5a.5.5 0 0 1 .492.41z' })));
const ForwardRef = forwardRef(LegacyArrowLeft1pxIcon);
export default ForwardRef;
