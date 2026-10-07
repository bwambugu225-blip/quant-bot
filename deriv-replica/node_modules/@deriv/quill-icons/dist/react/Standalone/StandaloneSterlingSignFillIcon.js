import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSterlingSignFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M14.125 12.79v2.46H18.5c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25h-4.375v1.758a6.2 6.2 0 0 1-.898 3.203l-.04.039H21c.664 0 1.25.586 1.25 1.25 0 .703-.586 1.25-1.25 1.25H11c-.469 0-.898-.234-1.094-.625a1.2 1.2 0 0 1 0-1.25l1.172-1.953c.352-.586.547-1.25.547-1.914V17.75H11c-.703 0-1.25-.547-1.25-1.25 0-.664.547-1.25 1.25-1.25h.625v-2.46c0-2.774 2.227-5.04 5-5.04.547 0 1.055.117 1.602.273l3.164 1.055a1.25 1.25 0 0 1 .78 1.602c-.233.625-.937.976-1.562.78l-3.203-1.054c-.234-.078-.508-.156-.781-.156-1.406 0-2.5 1.133-2.5 2.54' })));
const ForwardRef = forwardRef(StandaloneSterlingSignFillIcon);
export default ForwardRef;
