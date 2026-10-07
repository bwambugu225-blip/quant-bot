import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleArrowDownLeftFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 26.5c-3.594 0-6.875-1.875-8.672-5-1.797-3.086-1.797-6.875 0-10 1.797-3.086 5.078-5 8.672-5 3.555 0 6.836 1.914 8.633 5 1.797 3.125 1.797 6.914 0 10a9.93 9.93 0 0 1-8.633 5m2.5-5.625c.508 0 .938-.39.938-.937A.95.95 0 0 0 18.5 19h-3.71l5.312-5.273a.92.92 0 0 0 0-1.29c-.391-.39-.977-.39-1.329 0L13.5 17.712v-4.023a.95.95 0 0 0-.937-.938.925.925 0 0 0-.938.938v6.25c0 .546.39.937.938.937z' })));
const ForwardRef = forwardRef(StandaloneCircleArrowDownLeftFillIcon);
export default ForwardRef;
