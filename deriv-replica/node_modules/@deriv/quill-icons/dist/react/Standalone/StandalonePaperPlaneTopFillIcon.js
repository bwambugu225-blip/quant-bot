import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePaperPlaneTopFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm7.914 7.594 17.266 7.5c1.25.547 1.25 2.304 0 2.851l-17.266 7.5c-1.328.586-2.695-.898-1.992-2.187l2.734-5.04c.156-.312.469-.546.86-.585l6.875-.86c.117 0 .234-.117.234-.273a.25.25 0 0 0-.234-.234l-6.875-.86c-.391-.078-.703-.273-.86-.586L5.922 9.781c-.703-1.289.664-2.773 1.992-2.187' })));
const ForwardRef = forwardRef(StandalonePaperPlaneTopFillIcon);
export default ForwardRef;
