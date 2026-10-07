import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCaretDownRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm16.195 20.172 4.688-4.414c.078-.078.078-.117.078-.195 0-.157-.117-.313-.273-.313h-9.415c-.156 0-.273.156-.273.313 0 .078 0 .117.078.195l4.688 4.414c.039.078.117.078.234.078.078 0 .156 0 .195-.078m.86.937c-.274.274-.664.391-1.055.391-.43 0-.82-.117-1.094-.39l-4.687-4.454c-.313-.273-.469-.703-.469-1.093 0-.86.664-1.563 1.523-1.563l9.415.04c.859 0 1.562.663 1.562 1.523 0 .39-.195.82-.508 1.093z' })));
const ForwardRef = forwardRef(StandaloneCaretDownRegularIcon);
export default ForwardRef;
