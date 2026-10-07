import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m-5.04 10.977 4.376 4.375c.351.39.937.39 1.328 0L21 17.477a.856.856 0 0 0 0-1.29.856.856 0 0 0-1.29 0l-2.773 2.774v-7.148a.95.95 0 0 0-.937-.938.925.925 0 0 0-.937.938l-.04 7.148-2.773-2.773a.856.856 0 0 0-1.29 0 .856.856 0 0 0 0 1.289' })));
const ForwardRef = forwardRef(StandaloneCircleArrowDownFillIcon);
export default ForwardRef;
