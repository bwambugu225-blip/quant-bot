import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneScissorsBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M25.766 23.688a.974.974 0 0 1-1.328.117l-6.25-5.235 1.445-1.25 6.015 5.04c.391.35.43.937.118 1.328M10.375 8.375c-.898 0-1.719.508-2.187 1.25-.43.781-.43 1.758 0 2.5a2.54 2.54 0 0 0 2.187 1.25c.86 0 1.68-.469 2.148-1.25.43-.742.43-1.719 0-2.5-.468-.742-1.289-1.25-2.148-1.25m0-1.875c2.383 0 4.375 1.992 4.375 4.375 0 .703-.195 1.367-.469 1.953l2.93 2.461 7.227-6.055a.974.974 0 0 1 1.328.118.974.974 0 0 1-.118 1.328l-11.367 9.53c.274.587.469 1.25.469 1.915 0 2.422-1.992 4.375-4.375 4.375A4.37 4.37 0 0 1 6 22.125c0-2.383 1.953-4.375 4.375-4.375 1.016 0 1.992.39 2.734.977l2.657-2.227-2.657-2.187a4.45 4.45 0 0 1-2.734.937A4.37 4.37 0 0 1 6 10.875C6 8.492 7.953 6.5 10.375 6.5m2.5 15.625c0-.86-.508-1.68-1.25-2.148-.781-.43-1.758-.43-2.5 0-.781.468-1.25 1.289-1.25 2.148a2.54 2.54 0 0 0 1.25 2.188c.742.43 1.719.43 2.5 0 .742-.47 1.25-1.29 1.25-2.188' })));
const ForwardRef = forwardRef(StandaloneScissorsBoldIcon);
export default ForwardRef;
