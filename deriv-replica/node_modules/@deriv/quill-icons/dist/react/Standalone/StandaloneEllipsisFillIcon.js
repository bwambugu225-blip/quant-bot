import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEllipsisFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.563 16.5c0-.781.39-1.484 1.093-1.875.664-.39 1.485-.39 2.188 0a2.18 2.18 0 0 1 1.094 1.875 2.2 2.2 0 0 1-1.094 1.914c-.703.39-1.524.39-2.188 0-.703-.39-1.094-1.094-1.094-1.914m6.25 0c0-.781.39-1.484 1.093-1.875.664-.39 1.485-.39 2.188 0a2.18 2.18 0 0 1 1.093 1.875 2.2 2.2 0 0 1-1.093 1.914c-.703.39-1.524.39-2.188 0-.703-.39-1.094-1.094-1.094-1.914m8.437-2.187c.781 0 1.484.43 1.875 1.093.39.703.39 1.524 0 2.188a2.1 2.1 0 0 1-1.875 1.093c-.82 0-1.523-.39-1.914-1.093-.39-.664-.39-1.485 0-2.188a2.2 2.2 0 0 1 1.914-1.094' })));
const ForwardRef = forwardRef(StandaloneEllipsisFillIcon);
export default ForwardRef;
