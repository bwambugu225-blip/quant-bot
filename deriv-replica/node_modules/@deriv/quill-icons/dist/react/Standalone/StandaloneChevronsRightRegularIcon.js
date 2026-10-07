import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneChevronsRightRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.93 24.469a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l7.07-7.07-7.07-7.031a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l7.5 7.5a.66.66 0 0 1 0 .899zm7.5 0a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l7.07-7.07-7.07-7.031a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l7.5 7.5a.66.66 0 0 1 0 .899z' })));
const ForwardRef = forwardRef(StandaloneChevronsRightRegularIcon);
export default ForwardRef;
