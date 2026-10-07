import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleExclamationFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m0-15a.925.925 0 0 0-.937.938v4.374c0 .547.39.938.937.938.508 0 .938-.39.938-.937v-4.375A.95.95 0 0 0 16 11.5m-1.25 8.75c0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneCircleExclamationFillIcon);
export default ForwardRef;
