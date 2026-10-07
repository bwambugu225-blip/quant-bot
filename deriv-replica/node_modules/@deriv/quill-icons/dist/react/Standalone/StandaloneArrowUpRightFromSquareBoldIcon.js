import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowUpRightFromSquareBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M17.875 7.438c0-.508.39-.938.938-.938h6.21c.547 0 .938.43.938.938v6.25c0 .546-.39.937-.938.937a.925.925 0 0 1-.937-.937V9.703l-8.711 8.711a.856.856 0 0 1-1.29 0c-.39-.352-.39-.937 0-1.328l8.712-8.711h-3.985c-.546 0-.937-.39-.937-.937m-9.062.312h5a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-5a.925.925 0 0 0-.938.938v13.125c0 .546.39.937.938.937h13.125c.507 0 .937-.39.937-.937v-5c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v5a2.826 2.826 0 0 1-2.812 2.812H8.813A2.8 2.8 0 0 1 6 23.688V10.563A2.826 2.826 0 0 1 8.813 7.75' })));
const ForwardRef = forwardRef(StandaloneArrowUpRightFromSquareBoldIcon);
export default ForwardRef;
