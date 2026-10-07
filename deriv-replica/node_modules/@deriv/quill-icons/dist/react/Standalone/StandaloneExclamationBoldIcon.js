import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneExclamationBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.938 8.688v11.25c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937V8.688c0-.508.39-.938.937-.938a.95.95 0 0 1 .938.938M16 25.25c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneExclamationBoldIcon);
export default ForwardRef;
