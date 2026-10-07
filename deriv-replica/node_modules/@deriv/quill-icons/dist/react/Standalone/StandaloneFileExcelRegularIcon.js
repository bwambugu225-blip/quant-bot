import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileExcelRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.5 25.25c.664 0 1.25-.547 1.25-1.25V14h-4.375a1.85 1.85 0 0 1-1.875-1.875V7.75h-5c-.703 0-1.25.586-1.25 1.25v15c0 .703.547 1.25 1.25 1.25zm-3.125-12.5h4.336c-.04-.078-.078-.195-.156-.273l-4.532-4.532c-.078-.078-.195-.117-.273-.156v4.336c0 .352.273.625.625.625M11.5 6.5h6.094c.468 0 .976.234 1.328.586l4.492 4.492c.352.352.586.86.586 1.328V24c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 9 24V9c0-1.367 1.094-2.5 2.5-2.5m3.32 9.648 1.68 2.422 1.64-2.422c.235-.273.626-.351.9-.156a.665.665 0 0 1 .155.899l-1.953 2.734 1.953 2.773c.196.313.117.665-.156.899-.312.195-.664.117-.898-.156L16.5 20.719l-1.68 2.422a.665.665 0 0 1-.898.156c-.274-.235-.352-.625-.156-.899l1.953-2.773-1.953-2.734a.665.665 0 0 1 .156-.899.665.665 0 0 1 .898.156' })));
const ForwardRef = forwardRef(StandaloneFileExcelRegularIcon);
export default ForwardRef;
