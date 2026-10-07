import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneInfoBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.438 9.313c0-.547.273-1.055.78-1.329.47-.273 1.055-.273 1.563 0 .469.274.782.782.782 1.329 0 .585-.313 1.093-.782 1.367-.508.273-1.093.273-1.562 0-.508-.274-.781-.782-.781-1.367m-1.563 5c0-.508.39-.938.938-.938H16a.95.95 0 0 1 .938.938v10.312h1.875a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-5.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h1.874V15.25h-1.25c-.546 0-.937-.39-.937-.937' })));
const ForwardRef = forwardRef(StandaloneInfoBoldIcon);
export default ForwardRef;
