import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowDownRightFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5m-2.5 14.375h5.898c.547 0 .938-.39.938-.937v-6.25a.925.925 0 0 0-.938-.938.95.95 0 0 0-.937.938v4.023l-5.273-5.273a.856.856 0 0 0-1.29 0 .856.856 0 0 0 0 1.289L17.172 19H13.5a.925.925 0 0 0-.937.938c0 .546.39.937.937.937' })));
const ForwardRef = forwardRef(StandaloneCircleArrowDownRightFillIcon);
export default ForwardRef;
