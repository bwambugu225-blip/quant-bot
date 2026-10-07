import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const CurrencyBchIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#8DC351', d: 'M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16 7.163 0 16 0s16 7.163 16 16' }),
    React.createElement("path", { fill: '#fff', d: 'M21.207 10.534c-.776-1.972-2.722-2.15-4.988-1.71l-.807-2.813-1.712.491.786 2.74c-.45.128-.908.27-1.363.41l-.79-2.758-1.711.49.805 2.813q-.552.173-1.085.328l-.003-.01-2.362.677.525 1.83s1.258-.388 1.243-.358c.694-.199 1.035.139 1.2.468l.92 3.204c.047-.013.11-.029.184-.04l-.181.052 1.287 4.49c.032.227.004.612-.48.752.027.013-1.246.356-1.246.356l.247 2.143 2.228-.64c.415-.117.825-.227 1.226-.34l.817 2.845 1.71-.49-.807-2.815q.688-.183 1.372-.38l.802 2.803 1.713-.491-.814-2.84c2.831-.991 4.638-2.294 4.113-5.07-.422-2.234-1.724-2.912-3.471-2.836.848-.79 1.213-1.859.642-3.301m-.65 6.77c.61 2.127-3.1 2.929-4.26 3.263l-1.081-3.77c1.16-.333 4.704-1.71 5.34.508zm-2.322-5.09c.554 1.935-2.547 2.58-3.514 2.857l-.98-3.419c.966-.277 3.915-1.455 4.494.563z' })));
const ForwardRef = forwardRef(CurrencyBchIcon);
export default ForwardRef;
