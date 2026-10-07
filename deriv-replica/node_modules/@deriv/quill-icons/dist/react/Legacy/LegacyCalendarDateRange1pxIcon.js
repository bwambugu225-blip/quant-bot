import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyCalendarDateRange1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.5 1a.5.5 0 0 1 .5.5V2h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h2v-.5a.5.5 0 0 1 1 0V2h6v-.5a.5.5 0 0 1 .5-.5M14 6H2v8h12zm-3 4.5a1 1 0 1 1-.866 1.501L4 12v-1h6.134a1 1 0 0 1 .866-.5m-6-3a1 1 0 0 1 .866.5H12v1l-6.134.001A1 1 0 1 1 5 7.5M4 3H2v2h12V3h-2v.5a.5.5 0 0 1-1 0V3H5v.5a.5.5 0 0 1-1 0z' })));
const ForwardRef = forwardRef(LegacyCalendarDateRange1pxIcon);
export default ForwardRef;
