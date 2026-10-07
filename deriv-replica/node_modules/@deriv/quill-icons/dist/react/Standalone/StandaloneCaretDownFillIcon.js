import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCaretDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm15.102 21.148-5-5a1.26 1.26 0 0 1-.274-1.367A1.28 1.28 0 0 1 11 14h10c.508 0 .938.313 1.133.781a1.26 1.26 0 0 1-.274 1.367l-5 5a1.205 1.205 0 0 1-1.757 0' })));
const ForwardRef = forwardRef(StandaloneCaretDownFillIcon);
export default ForwardRef;
