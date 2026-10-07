import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePlusBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.938 9.313v6.25h6.25a.95.95 0 0 1 .937.937c0 .547-.43.938-.937.938h-6.25v6.25c0 .546-.43.937-.938.937-.547 0-.937-.39-.937-.937v-6.25h-6.25c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937h6.25v-6.25c0-.508.39-.938.937-.938a.95.95 0 0 1 .938.938' })));
const ForwardRef = forwardRef(StandalonePlusBoldIcon);
export default ForwardRef;
