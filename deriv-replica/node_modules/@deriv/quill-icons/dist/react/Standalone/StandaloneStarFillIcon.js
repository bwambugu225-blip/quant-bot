import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneStarFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm17.094 7.203 2.539 5.195 5.586.82c.468.079.86.391 1.015.86.157.43.04.938-.312 1.25l-4.063 4.024.977 5.703c.078.468-.117.937-.508 1.21-.39.313-.898.313-1.328.118l-5-2.695-5.04 2.695c-.39.195-.898.195-1.288-.117a1.23 1.23 0 0 1-.508-1.211l.938-5.703-4.063-4.024c-.312-.312-.43-.82-.312-1.25a1.27 1.27 0 0 1 1.015-.86l5.625-.82 2.5-5.195c.195-.43.625-.703 1.133-.703.469 0 .898.273 1.094.703' })));
const ForwardRef = forwardRef(StandaloneStarFillIcon);
export default ForwardRef;
