import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyPositionIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M9.5 1A1.5 1.5 0 0 1 11 2.5V3h3.5A1.5 1.5 0 0 1 16 4.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 13.5v-9A1.5 1.5 0 0 1 1.5 3H5v-.5A1.5 1.5 0 0 1 6.5 1zM15 9.127l-2.804 1.558-.19.095a2.5 2.5 0 0 1-1.024.22H5.018l-.211-.009a2.5 2.5 0 0 1-1.003-.306L1 9.127V13.5l.008.09A.5.5 0 0 0 1.5 14h13l.09-.008A.5.5 0 0 0 15 13.5zM14.5 4h-13l-.09.008A.5.5 0 0 0 1 4.5v3.483l3.29 1.828.137.067a1.5 1.5 0 0 0 .591.122h5.964l.152-.008a1.5 1.5 0 0 0 .576-.18L15 7.982V4.5l-.008-.09A.5.5 0 0 0 14.5 4m-5 4a.5.5 0 0 1 0 1h-3l-.09-.008A.5.5 0 0 1 6.5 8zm0-6h-3a.5.5 0 0 0-.5.5V3h4v-.5a.5.5 0 0 0-.5-.5' })));
const ForwardRef = forwardRef(LegacyPositionIcon);
export default ForwardRef;
