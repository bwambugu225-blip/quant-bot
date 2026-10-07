import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const AccountsPlaceholderIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 32, height: 32, fill: '#000', fillOpacity: 0.72, rx: 6 })));
const ForwardRef = forwardRef(AccountsPlaceholderIcon);
export default ForwardRef;
