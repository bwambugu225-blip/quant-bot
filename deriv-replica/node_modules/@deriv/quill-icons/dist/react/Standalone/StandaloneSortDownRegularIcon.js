import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSortDownRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.766 23.922c.039.078.117.078.234.078.078 0 .156 0 .195-.078l4.688-4.414c.078-.078.117-.117.117-.195a.336.336 0 0 0-.312-.313h-9.415c-.156 0-.273.156-.273.313 0 .078 0 .117.078.195zm-.86.937-4.687-4.453c-.313-.273-.469-.703-.469-1.093 0-.86.664-1.563 1.523-1.563h9.415c.859 0 1.562.703 1.562 1.563 0 .39-.195.82-.508 1.093l-4.687 4.453c-.274.274-.664.391-1.055.391-.43 0-.82-.117-1.094-.39' })));
const ForwardRef = forwardRef(StandaloneSortDownRegularIcon);
export default ForwardRef;
