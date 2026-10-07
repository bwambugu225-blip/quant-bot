import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCalendarFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11 7.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25V9h5V7.75c0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25V9h1.875c1.016 0 1.875.86 1.875 1.875v1.875H7.25v-1.875C7.25 9.859 8.07 9 9.125 9H11zM24.75 14v10.625c0 1.055-.86 1.875-1.875 1.875H9.125a1.85 1.85 0 0 1-1.875-1.875V14z' })));
const ForwardRef = forwardRef(StandaloneCalendarFillIcon);
export default ForwardRef;
