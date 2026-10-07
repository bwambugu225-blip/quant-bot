import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePasteRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.313 8.531c-.04.274-.313.469-.626.469h-.312a.64.64 0 0 0-.625.625v.625h5v-.625c0-.312-.312-.625-.625-.625h-.352a.63.63 0 0 1-.625-.469c-.078-.43-.468-.781-.898-.781a.964.964 0 0 0-.937.781M12.25 6.5c.86 0 1.602.547 1.953 1.25H16c1.367 0 2.5 1.133 2.5 2.5h-1.25C17.25 9.586 16.664 9 16 9h-.117c.078.195.117.43.117.625v.703a3.06 3.06 0 0 0-1.875 1.172H9.75c-.703 0-1.25-.547-1.25-1.25v-.625c0-.195.04-.43.078-.625H8.5c-.703 0-1.25.586-1.25 1.25V21.5c0 .703.547 1.25 1.25 1.25h5V24h-5A2.47 2.47 0 0 1 6 21.5V10.25c0-1.367 1.094-2.5 2.5-2.5h1.758c.351-.703 1.094-1.25 1.992-1.25M23.5 25.25c.664 0 1.25-.547 1.25-1.25v-7.969a.63.63 0 0 0-.195-.43l-2.657-2.656a.63.63 0 0 0-.43-.195H17.25c-.703 0-1.25.586-1.25 1.25v10c0 .703.547 1.25 1.25 1.25zm1.914-10.547c.352.352.586.86.586 1.328V24c0 1.406-1.133 2.5-2.5 2.5h-6.25a2.47 2.47 0 0 1-2.5-2.5V14c0-1.367 1.094-2.5 2.5-2.5h4.219c.468 0 .976.195 1.328.547z' })));
const ForwardRef = forwardRef(StandalonePasteRegularIcon);
export default ForwardRef;
