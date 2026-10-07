import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneEyeBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 9.625c-2.578 0-4.648 1.172-6.25 2.656A14 14 0 0 0 6.664 16.5c.547 1.172 1.563 2.852 3.086 4.258 1.602 1.484 3.672 2.617 6.25 2.617 2.54 0 4.61-1.133 6.21-2.617 1.524-1.406 2.58-3.086 3.087-4.258-.508-1.172-1.563-2.812-3.047-4.219-1.64-1.484-3.71-2.656-6.25-2.656m-7.54 1.29C10.298 9.194 12.837 7.75 16 7.75c3.125 0 5.664 1.445 7.5 3.164s3.047 3.711 3.633 5.117a1.4 1.4 0 0 1 0 .977c-.586 1.367-1.797 3.398-3.633 5.117S19.125 25.25 16 25.25c-3.164 0-5.703-1.406-7.54-3.125-1.835-1.719-3.046-3.75-3.632-5.117a1.4 1.4 0 0 1 0-.977c.586-1.406 1.797-3.437 3.633-5.117m7.54 8.71a3.11 3.11 0 0 0 3.125-3.125A3.134 3.134 0 0 0 16 13.375h-.078c.039.234.078.43.078.625 0 1.406-1.133 2.5-2.5 2.5-.234 0-.43 0-.625-.078v.078c0 1.758 1.367 3.125 3.125 3.125m0-8.125c1.758 0 3.398.977 4.297 2.5.898 1.563.898 3.477 0 5A4.96 4.96 0 0 1 16 21.5a4.97 4.97 0 0 1-4.336-2.5c-.898-1.523-.898-3.437 0-5 .899-1.523 2.54-2.5 4.336-2.5' })));
const ForwardRef = forwardRef(StandaloneEyeBoldIcon);
export default ForwardRef;
