import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMoneyBillFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9h17.5c1.367 0 2.5 1.133 2.5 2.5v10c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5v-10c0-1.367 1.094-2.5 2.5-2.5m2.5 12.5c0-1.367-1.133-2.5-2.5-2.5v2.5zM7.25 14c1.367 0 2.5-1.094 2.5-2.5h-2.5zm15 7.5h2.5V19a2.49 2.49 0 0 0-2.5 2.5m2.5-7.5v-2.5h-2.5c0 1.406 1.094 2.5 2.5 2.5M16 12.75c-1.367 0-2.578.742-3.281 1.875-.664 1.172-.664 2.617 0 3.75.703 1.172 1.914 1.875 3.281 1.875 1.328 0 2.54-.703 3.242-1.875.664-1.133.664-2.578 0-3.75-.703-1.133-1.914-1.875-3.242-1.875' })));
const ForwardRef = forwardRef(StandaloneMoneyBillFillIcon);
export default ForwardRef;
