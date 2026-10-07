import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneAppleIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M20.922 17.008c0 .078-.117 2.383 2.422 3.594-.469 1.445-2.11 4.648-4.024 4.648-1.093 0-1.718-.703-2.968-.703-1.29 0-1.993.703-2.97.703-1.874.078-3.671-3.437-4.179-4.883a9.3 9.3 0 0 1-.547-3.164c0-3.476 2.305-5.156 4.492-5.195 1.055 0 2.383.742 2.97.742.546 0 2.07-.898 3.476-.781 1.445.117 2.539.664 3.281 1.719-1.29.82-1.953 1.874-1.953 3.32m-2.188-6.406c-.78.898-1.718 1.406-2.734 1.328-.078-1.055.313-2.032 1.016-2.813.625-.703 1.718-1.289 2.656-1.367 0 .43.117 1.602-.938 2.852' })));
const ForwardRef = forwardRef(StandaloneAppleIcon);
export default ForwardRef;
