import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronDownRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.43 21.969a.66.66 0 0 1-.899 0l-7.5-7.5a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0L16 20.64l7.031-7.07a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899z' })));
const ForwardRef = forwardRef(StandaloneChevronDownRegularIcon);
export default ForwardRef;
