import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCloneRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 25.25h8.75c.664 0 1.25-.547 1.25-1.25v-2.5h1.25V24c0 1.406-1.133 2.5-2.5 2.5H8.5A2.47 2.47 0 0 1 6 24v-8.75c0-1.367 1.094-2.5 2.5-2.5H11V14H8.5c-.703 0-1.25.586-1.25 1.25V24c0 .703.547 1.25 1.25 1.25M14.75 19h8.75c.664 0 1.25-.547 1.25-1.25V9c0-.664-.586-1.25-1.25-1.25h-8.75c-.703 0-1.25.586-1.25 1.25v8.75c0 .703.547 1.25 1.25 1.25m-2.5-1.25V9c0-1.367 1.094-2.5 2.5-2.5h8.75C24.867 6.5 26 7.633 26 9v8.75c0 1.406-1.133 2.5-2.5 2.5h-8.75a2.47 2.47 0 0 1-2.5-2.5' })));
const ForwardRef = forwardRef(StandaloneCloneRegularIcon);
export default ForwardRef;
