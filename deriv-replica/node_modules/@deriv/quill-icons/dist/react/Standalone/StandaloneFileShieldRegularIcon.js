import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileShieldRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.25 25.25h.117a8.4 8.4 0 0 0 1.055.977 2.5 2.5 0 0 1-1.172.312h-10a2.49 2.49 0 0 1-2.5-2.5V9c0-1.367 1.094-2.5 2.5-2.5h6.094c.469 0 .976.234 1.328.586l4.492 4.492c.352.352.586.86.586 1.328v1.68l-1.25.508V14h-4.375a1.85 1.85 0 0 1-1.875-1.875V7.75h-5C6.547 7.75 6 8.336 6 9v15c0 .703.547 1.25 1.25 1.25zm1.21-12.5c-.038-.078-.077-.195-.155-.273l-4.532-4.532c-.078-.078-.195-.117-.273-.156v4.336c0 .352.273.625.625.625zm-1.21 5.547c.04 2.07.86 5.039 3.75 6.64v-8.164zm8.75 0-3.75-1.524v8.165c2.852-1.602 3.672-4.57 3.71-6.641zm-4.023-2.969 4.687 1.875c.352.156.586.508.586.86 0 2.5-1.016 6.601-5.273 8.398a1.2 1.2 0 0 1-.743 0C16.977 24.664 16 20.563 16 18.063c0-.352.234-.704.586-.86l4.687-1.875a.97.97 0 0 1 .665 0z' })));
const ForwardRef = forwardRef(StandaloneFileShieldRegularIcon);
export default ForwardRef;
