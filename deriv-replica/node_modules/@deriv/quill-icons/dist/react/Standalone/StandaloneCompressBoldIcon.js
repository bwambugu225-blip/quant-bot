import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCompressBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M13.5 8.688v4.374c0 .547-.43.938-.937.938H8.186c-.546 0-.937-.39-.937-.937 0-.508.39-.938.938-.938h3.437V8.688c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938M8.188 19h4.374a.95.95 0 0 1 .938.938v4.375c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-3.438H8.188c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938M20.374 8.688v3.437h3.438a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-4.375c-.547 0-.938-.39-.938-.937V8.686c0-.507.39-.937.938-.937a.95.95 0 0 1 .937.938M19.438 19h4.375a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-3.438v3.438c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937v-4.375c0-.508.39-.938.938-.938' })));
const ForwardRef = forwardRef(StandaloneCompressBoldIcon);
export default ForwardRef;
