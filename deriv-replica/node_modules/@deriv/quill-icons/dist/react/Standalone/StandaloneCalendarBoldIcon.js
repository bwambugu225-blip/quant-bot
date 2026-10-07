import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCalendarBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.188 7.438V9h5.624V7.438c0-.508.391-.938.938-.938a.95.95 0 0 1 .938.938V9h1.562c1.367 0 2.5 1.133 2.5 2.5V24c0 1.406-1.133 2.5-2.5 2.5H9.75a2.47 2.47 0 0 1-2.5-2.5V11.5c0-1.367 1.094-2.5 2.5-2.5h1.563V7.438c0-.508.39-.938.937-.938a.95.95 0 0 1 .938.938M9.125 14v10c0 .352.273.625.625.625h12.5a.64.64 0 0 0 .625-.625V14z' })));
const ForwardRef = forwardRef(StandaloneCalendarBoldIcon);
export default ForwardRef;
