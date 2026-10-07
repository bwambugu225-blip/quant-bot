import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCheckRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M24.555 10.445a.66.66 0 0 1 0 .899L13.93 21.969a.66.66 0 0 1-.899 0l-5.625-5.625a.66.66 0 0 1 0-.899.66.66 0 0 1 .899 0l5.195 5.196 10.156-10.196a.66.66 0 0 1 .899 0' })));
const ForwardRef = forwardRef(StandaloneCheckRegularIcon);
export default ForwardRef;
