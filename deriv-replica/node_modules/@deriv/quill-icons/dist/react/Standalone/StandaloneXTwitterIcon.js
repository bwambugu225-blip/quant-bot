import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneXTwitterIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.195 8.375h2.735l-6.016 6.914 7.11 9.336h-5.547l-4.375-5.664-4.961 5.664H7.367l6.446-7.344-6.797-8.906h5.703l3.906 5.195zm-.976 14.61h1.523L11.898 9.937h-1.64z' })));
const ForwardRef = forwardRef(StandaloneXTwitterIcon);
export default ForwardRef;
