import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneNineRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 14c0 2.773 2.227 5 5 5 2.695 0 4.922-2.148 5-4.844V14c0-2.734-2.266-5-5-5-2.773 0-5 2.266-5 5m6.29 6.133q-.645.117-1.29.117A6.22 6.22 0 0 1 9.75 14 6.243 6.243 0 0 1 16 7.75c3.438 0 6.25 2.813 6.25 6.25 0 .078 0 .156-.04.234-.038 1.485-.585 2.93-1.6 4.024l-6.016 6.797c-.235.273-.625.273-.899.039a.58.58 0 0 1-.039-.86z' })));
const ForwardRef = forwardRef(StandaloneNineRegularIcon);
export default ForwardRef;
