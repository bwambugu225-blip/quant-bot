import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpFromBracketFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.86 6.89 5 5c.507.47.507 1.29 0 1.758a1.205 1.205 0 0 1-1.758 0l-2.852-2.851V19c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25v-8.203l-2.89 2.851a1.205 1.205 0 0 1-1.758 0 1.204 1.204 0 0 1 0-1.757l5-5a1.205 1.205 0 0 1 1.757 0M9.75 20.25v2.5c0 .703.547 1.25 1.25 1.25h10c.664 0 1.25-.547 1.25-1.25v-2.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25v2.5c0 2.07-1.68 3.75-3.75 3.75H11c-2.07 0-3.75-1.68-3.75-3.75v-2.5c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneArrowUpFromBracketFillIcon);
export default ForwardRef;
