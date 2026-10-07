import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLinkSimpleBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M4.75 16.5A6.243 6.243 0 0 1 11 10.25h2.813a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H11c-2.422 0-4.375 1.992-4.375 4.375A4.37 4.37 0 0 0 11 20.875h2.813a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H11a6.22 6.22 0 0 1-6.25-6.25m22.5 0A6.243 6.243 0 0 1 21 22.75h-2.812c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938H21c2.383 0 4.375-1.953 4.375-4.375 0-2.383-1.992-4.375-4.375-4.375h-2.812c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938H21c3.438 0 6.25 2.813 6.25 6.25m-15.312-.937h8.124A.95.95 0 0 1 21 16.5c0 .547-.43.938-.937.938h-8.125c-.547 0-.938-.391-.938-.938 0-.508.39-.937.938-.937' })));
const ForwardRef = forwardRef(StandaloneLinkSimpleBoldIcon);
export default ForwardRef;
