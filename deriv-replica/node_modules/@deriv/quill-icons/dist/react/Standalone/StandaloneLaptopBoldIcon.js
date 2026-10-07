import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLaptopBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M23.5 9.625h-15a.64.64 0 0 0-.625.625V19H6v-8.75c0-1.367 1.094-2.5 2.5-2.5h15c1.367 0 2.5 1.133 2.5 2.5V19h-1.875v-8.75c0-.312-.312-.625-.625-.625M7.25 23.375h17.5c.781 0 1.484-.508 1.758-1.25H5.453c.274.742.977 1.25 1.797 1.25M3.5 21.5c0-.664.547-1.25 1.25-1.25h22.5c.664 0 1.25.586 1.25 1.25 0 2.07-1.68 3.75-3.75 3.75H7.25c-2.07 0-3.75-1.68-3.75-3.75' })));
const ForwardRef = forwardRef(StandaloneLaptopBoldIcon);
export default ForwardRef;
