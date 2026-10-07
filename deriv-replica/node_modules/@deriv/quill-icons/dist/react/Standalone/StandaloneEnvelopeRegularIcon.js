import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEnvelopeRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 10.25c-.703 0-1.25.586-1.25 1.25v1.563l7.617 5.624a1.94 1.94 0 0 0 2.227 0l7.656-5.625V11.5c0-.664-.586-1.25-1.25-1.25zm-1.25 4.375V21.5c0 .703.547 1.25 1.25 1.25h15c.664 0 1.25-.547 1.25-1.25v-6.875l-6.914 5.078a3.23 3.23 0 0 1-3.711 0zM6 11.5C6 10.133 7.094 9 8.5 9h15c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5h-15A2.47 2.47 0 0 1 6 21.5z' })));
const ForwardRef = forwardRef(StandaloneEnvelopeRegularIcon);
export default ForwardRef;
