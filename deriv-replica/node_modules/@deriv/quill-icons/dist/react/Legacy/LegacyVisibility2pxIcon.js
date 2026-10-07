import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyVisibility2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("g", { fillRule: 'evenodd', clipRule: 'evenodd' },
        React.createElement("path", { d: 'M8 4.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5M6.25 8a1.75 1.75 0 1 1 3.5 0 1.75 1.75 0 0 1-3.5 0' }),
        React.createElement("path", { d: 'M8 2c-2.162 0-3.893.986-5.142 2.072C1.61 5.157.78 6.396.386 7.052a1.84 1.84 0 0 0 0 1.897c.394.655 1.225 1.894 2.472 2.979C4.108 13.014 5.838 14 8 14s3.893-.986 5.142-2.072c1.247-1.085 2.078-2.324 2.472-2.98a1.84 1.84 0 0 0 0-1.897c-.394-.655-1.225-1.894-2.472-2.979C11.892 2.986 10.162 2 8 2m-3.83 8.419C3.19 9.565 2.504 8.576 2.15 8c.353-.576 1.04-1.565 2.02-2.419C5.196 4.69 6.48 4 8 4s2.804.69 3.83 1.581c.98.854 1.667 1.843 2.02 2.419-.353.576-1.04 1.565-2.02 2.419C10.804 11.31 9.52 12 8 12s-2.804-.69-3.83-1.581' }))));
const ForwardRef = forwardRef(LegacyVisibility2pxIcon);
export default ForwardRef;
