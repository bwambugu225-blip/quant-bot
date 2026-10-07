import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyProfileSmIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12 2c5.523 0 10 4.477 10 10a9.98 9.98 0 0 1-3.804 7.85L18 20a9.95 9.95 0 0 1-6 2C6.477 22 2 17.523 2 12S6.477 2 12 2m2.5 11.5h-5a2.5 2.5 0 0 0-2.495 2.336L7 16v3.484A8.96 8.96 0 0 0 12 21c1.85 0 3.57-.559 5.001-1.516L17 16a2.5 2.5 0 0 0-2.5-2.5M12 3a9 9 0 0 0-6 15.709V16a3.5 3.5 0 0 1 3.308-3.495L9.5 12.5h5a3.5 3.5 0 0 1 3.495 3.308L18 16v2.708A9 9 0 0 0 12 3m0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6m0 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4' })));
const ForwardRef = forwardRef(LegacyProfileSmIcon);
export default ForwardRef;
