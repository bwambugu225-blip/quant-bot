import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleCaretDownFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m0 14.375c.234 0 .508-.078.664-.273l4.063-4.375c.273-.274.312-.665.195-1.016-.156-.352-.508-.586-.86-.586h-8.125c-.39 0-.742.234-.859.586-.156.351-.117.742.156 1.016l4.063 4.375c.195.195.43.273.703.273' })));
const ForwardRef = forwardRef(StandaloneCircleCaretDownFillIcon);
export default ForwardRef;
