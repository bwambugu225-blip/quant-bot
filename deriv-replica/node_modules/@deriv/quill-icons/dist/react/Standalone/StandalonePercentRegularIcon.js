import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePercentRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 10.25c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25M11 14a2.54 2.54 0 0 1-2.187-1.25c-.43-.742-.43-1.719 0-2.5C9.28 9.508 10.102 9 11 9c.86 0 1.68.508 2.148 1.25.43.781.43 1.758 0 2.5C12.68 13.531 11.86 14 11 14m10 6.25c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25 0-.664-.586-1.25-1.25-1.25M21 24a2.54 2.54 0 0 1-2.187-1.25c-.43-.742-.43-1.719 0-2.5C19.28 19.508 20.102 19 21 19c.86 0 1.68.508 2.148 1.25.43.781.43 1.758 0 2.5C22.68 23.531 21.86 24 21 24m2.305-13.906-13.75 13.75a.66.66 0 0 1-.899 0 .66.66 0 0 1 0-.899l13.75-13.75a.66.66 0 0 1 .899 0 .66.66 0 0 1 0 .899' })));
const ForwardRef = forwardRef(StandalonePercentRegularIcon);
export default ForwardRef;
