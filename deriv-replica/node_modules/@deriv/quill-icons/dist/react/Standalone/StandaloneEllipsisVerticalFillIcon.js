import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEllipsisVerticalFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 20.563c.781 0 1.484.43 1.875 1.093.39.703.39 1.524 0 2.188A2.1 2.1 0 0 1 16 24.937c-.82 0-1.523-.39-1.914-1.093-.39-.664-.39-1.485 0-2.188A2.2 2.2 0 0 1 16 20.563m0-6.25c.781 0 1.484.43 1.875 1.093.39.703.39 1.524 0 2.188A2.1 2.1 0 0 1 16 18.687c-.82 0-1.523-.39-1.914-1.093-.39-.664-.39-1.485 0-2.188A2.2 2.2 0 0 1 16 14.312m2.188-4.063a2.2 2.2 0 0 1-1.094 1.914c-.703.39-1.524.39-2.188 0-.703-.39-1.094-1.094-1.094-1.914 0-.781.391-1.484 1.094-1.875.664-.39 1.485-.39 2.188 0a2.18 2.18 0 0 1 1.093 1.875' })));
const ForwardRef = forwardRef(StandaloneEllipsisVerticalFillIcon);
export default ForwardRef;
