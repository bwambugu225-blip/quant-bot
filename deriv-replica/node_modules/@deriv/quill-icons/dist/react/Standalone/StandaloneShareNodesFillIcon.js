import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneShareNodesFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21 15.25a3.83 3.83 0 0 1-2.617-1.016L14.71 16.07c0 .117.039.274.039.43 0 .195-.04.313-.04.469l3.673 1.836A3.86 3.86 0 0 1 21 17.75a3.751 3.751 0 0 1 0 7.5c-2.07 0-3.75-1.68-3.75-3.75v-.43l-3.672-1.836A3.8 3.8 0 0 1 11 20.25a3.751 3.751 0 0 1 0-7.5c.977 0 1.914.43 2.578 1.055l3.672-1.836V11.5a3.751 3.751 0 0 1 7.5 0c0 2.07-1.68 3.75-3.75 3.75' })));
const ForwardRef = forwardRef(StandaloneShareNodesFillIcon);
export default ForwardRef;
