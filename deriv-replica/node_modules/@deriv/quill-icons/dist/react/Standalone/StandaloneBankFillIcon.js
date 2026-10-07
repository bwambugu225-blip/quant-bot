import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBankFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M15.492 6.617a1.4 1.4 0 0 1 .977 0l8.75 3.75c.547.235.86.82.742 1.406a1.216 1.216 0 0 1-1.211.977v.313c0 .546-.43.937-.937.937H8.188c-.547 0-.938-.39-.938-.937v-.313c-.625 0-1.133-.39-1.25-.977a1.26 1.26 0 0 1 .742-1.406zM11 15.25v7.5h1.563v-7.5h2.5v7.5h1.874v-7.5h2.5v7.5H21v-7.5h2.46v7.695c.04 0 .08 0 .08.04l1.874 1.25c.469.312.664.859.508 1.406a1.22 1.22 0 0 1-1.172.859H7.25c-.586 0-1.055-.352-1.21-.86a1.24 1.24 0 0 1 .507-1.406l1.875-1.25c0-.039.039-.039.078-.039V15.25zM16 9c-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25C17.25 9.586 16.664 9 16 9' })));
const ForwardRef = forwardRef(StandaloneBankFillIcon);
export default ForwardRef;
