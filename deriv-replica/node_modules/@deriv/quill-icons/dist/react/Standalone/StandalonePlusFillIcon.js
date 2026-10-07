import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePlusFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.25 9.625v5.625h5.625c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H17.25v5.625c0 .703-.586 1.25-1.25 1.25-.703 0-1.25-.547-1.25-1.25V17.75H9.125c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h5.625V9.625c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25' })));
const ForwardRef = forwardRef(StandalonePlusFillIcon);
export default ForwardRef;
