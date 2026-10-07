import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyArrowRight1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M2 8a.5.5 0 0 1 .5-.5h9.792L9.646 4.854a.5.5 0 0 1-.057-.638l.057-.07a.5.5 0 0 1 .708 0l3.5 3.5.044.052A.5.5 0 0 1 14 8l-.005-.072.005.052V8a.5.5 0 0 1-.023.151.5.5 0 0 1-.123.203l.044-.052-.033.04-.011.012-3.5 3.5a.5.5 0 1 1-.708-.707L12.292 8.5H2.5a.5.5 0 0 1-.492-.41z' })));
const ForwardRef = forwardRef(LegacyArrowRight1pxIcon);
export default ForwardRef;
