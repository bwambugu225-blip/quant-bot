import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRectangleAdBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 9.625a.64.64 0 0 0-.625.625v12.5c0 .352.273.625.625.625h17.5a.64.64 0 0 0 .625-.625v-12.5c0-.312-.312-.625-.625-.625zm-2.5.625c0-1.367 1.094-2.5 2.5-2.5h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5zm8.945 3.047 2.813 5.625a.925.925 0 0 1-.43 1.25c-.43.234-1.015.039-1.25-.43l-.195-.43h-3.555l-.195.43a.925.925 0 0 1-1.25.43.925.925 0 0 1-.43-1.25l2.813-5.625a.96.96 0 0 1 .859-.547c.352 0 .664.195.82.547m-.82 2.5-.86 1.64h1.68zm7.188.703a.925.925 0 0 0-.938.938c0 .546.39.937.938.937.507 0 .937-.39.937-.937a.95.95 0 0 0-.937-.938M21 14.82v-1.133c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938v5.625c0 .546-.43.937-.937.937-.274 0-.508-.078-.665-.273-.39.195-.78.273-1.21.273a2.8 2.8 0 0 1-2.813-2.812 2.826 2.826 0 0 1 2.813-2.813c.312 0 .625.078.937.195' })));
const ForwardRef = forwardRef(StandaloneRectangleAdBoldIcon);
export default ForwardRef;
