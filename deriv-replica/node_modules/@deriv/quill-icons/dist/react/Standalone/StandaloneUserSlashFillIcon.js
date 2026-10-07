import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneUserSlashFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm5.484 6.734 6.016 4.688a4.993 4.993 0 0 1 5-4.922c2.734 0 5 2.266 5 5 0 2.344-1.602 4.258-3.71 4.844l10.82 8.515c.43.313.507.899.156 1.29-.313.43-.899.507-1.29.156L4.353 8.18c-.43-.313-.508-.899-.157-1.29.313-.43.899-.507 1.29-.156m8.829 11.68 10.195 8.008c-.156.078-.274.078-.43.078H8.883a1.134 1.134 0 0 1-1.133-1.133c0-3.71 2.89-6.758 6.563-6.953' })));
const ForwardRef = forwardRef(StandaloneUserSlashFillIcon);
export default ForwardRef;
