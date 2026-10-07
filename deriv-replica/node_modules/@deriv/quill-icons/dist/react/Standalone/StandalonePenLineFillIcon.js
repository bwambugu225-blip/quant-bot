import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePenLineFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm22.445 7.281 1.524 1.524a2.523 2.523 0 0 1 0 3.554l-1.875 1.875-5.078-5.078 1.875-1.875a2.523 2.523 0 0 1 3.554 0M7.015 19.156l9.102-9.101 5.078 5.078-9.101 9.101c-.39.391-.899.703-1.446.86L5.922 26.46a.8.8 0 0 1-.899-.234.8.8 0 0 1-.234-.899l1.367-4.726a3.4 3.4 0 0 1 .86-1.446m7.423 5.469h11.875a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H14.438c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938' })));
const ForwardRef = forwardRef(StandalonePenLineFillIcon);
export default ForwardRef;
