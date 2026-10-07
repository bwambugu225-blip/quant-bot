import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWalletBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.438 7.75h14.375a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H9.438c-.899 0-1.563.703-1.563 1.563v10.625c0 .898.664 1.562 1.563 1.562h13.125c.859 0 1.562-.664 1.562-1.562v-6.875c0-.86-.703-1.563-1.562-1.563H10.688c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h11.875c1.875 0 3.437 1.563 3.437 3.438v6.874a3.443 3.443 0 0 1-3.437 3.438H9.438A3.42 3.42 0 0 1 6 21.813V11.188A3.443 3.443 0 0 1 9.438 7.75M21 19.625c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25' })));
const ForwardRef = forwardRef(StandaloneWalletBoldIcon);
export default ForwardRef;
