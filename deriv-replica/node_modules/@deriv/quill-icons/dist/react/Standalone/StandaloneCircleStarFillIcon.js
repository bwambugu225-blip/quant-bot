import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCircleStarFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 16.5a9.93 9.93 0 0 1 5-8.633c3.086-1.797 6.875-1.797 10 0 3.086 1.797 5 5.078 5 8.633 0 3.594-1.914 6.875-5 8.672-3.125 1.797-6.914 1.797-10 0-3.125-1.797-5-5.078-5-8.672m10-5.937c-.273 0-.469.156-.586.351l-1.406 2.89-3.164.47c-.235 0-.43.195-.508.39a.68.68 0 0 0 .156.664l2.305 2.227-.547 3.164c-.04.234.04.468.234.586.196.156.47.156.664.078L16 19.898l2.813 1.485c.195.078.468.078.664-.078.195-.117.273-.352.234-.586l-.508-3.164 2.266-2.227a.555.555 0 0 0 .156-.625.64.64 0 0 0-.508-.43l-3.164-.468-1.406-2.89a.62.62 0 0 0-.547-.313z' })));
const ForwardRef = forwardRef(StandaloneCircleStarFillIcon);
export default ForwardRef;
