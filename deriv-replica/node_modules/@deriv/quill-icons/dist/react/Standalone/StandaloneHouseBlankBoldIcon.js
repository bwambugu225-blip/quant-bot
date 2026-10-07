import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneHouseBlankBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.586 6.734 10.312 8.75c.391.352.43.938.118 1.329a.974.974 0 0 1-1.328.117l-.938-.82v7.265a3.11 3.11 0 0 1-3.125 3.125h-11.25c-1.758 0-3.125-1.367-3.125-3.125v-7.266l-.977.82a.974.974 0 0 1-1.328-.116.974.974 0 0 1 .117-1.329l10.313-8.75a.996.996 0 0 1 1.21 0m6.289 7.774L16 8.688l-6.875 5.82v8.867c0 .703.547 1.25 1.25 1.25h11.25c.664 0 1.25-.547 1.25-1.25z' })));
const ForwardRef = forwardRef(StandaloneHouseBlankBoldIcon);
export default ForwardRef;
