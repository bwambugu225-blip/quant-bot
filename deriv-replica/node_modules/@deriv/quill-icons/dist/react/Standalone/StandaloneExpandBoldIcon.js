import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneExpandBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.563 7.75a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H9.125v3.438c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937V8.686c0-.507.39-.937.938-.937zM7.25 19.938c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v3.437h3.438a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937H8.186c-.546 0-.937-.39-.937-.937zM23.813 7.75a.95.95 0 0 1 .937.938v4.374c0 .547-.43.938-.937.938-.547 0-.938-.39-.938-.937V9.625h-3.437c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938zm-.938 12.188c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v4.375c0 .546-.43.937-.937.937h-4.375c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h3.437z' })));
const ForwardRef = forwardRef(StandaloneExpandBoldIcon);
export default ForwardRef;
