import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagSouthKoreaIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("g", { fillRule: 'evenodd', clipRule: 'evenodd' },
        React.createElement("path", { fill: '#fff', d: 'M2 0h20a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2m17.945 4.944H17.5L16.278 2.5H17.5zm-15.89 0H6.5L7.722 2.5H6.5zm15.89 6.112H17.5L16.278 13.5H17.5zm-15.89 0H6.5L7.722 13.5H6.5zM12 12.278A4.28 4.28 0 0 1 7.722 8c0-.254 0-.611.411-1.83A4.278 4.278 0 1 1 12 12.278' }),
        React.createElement("path", { fill: '#000', fillOpacity: 0.08, d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z' }),
        React.createElement("path", { fill: '#0048AB', d: 'M16.278 8a4.278 4.278 0 1 1-8.556 0c0-1.369 2.873-1.943 5.29-1.727a3.2 3.2 0 0 1 .821-.106c1.351 0 2.445.821 2.445 1.833' }),
        React.createElement("path", { fill: '#CD0027', d: 'M11.389 7.389s1.094-1.222 2.444-1.222c1.351 0 2.445.821 2.445 1.833a4.278 4.278 0 0 0-8.145-1.83c-.41 1.219-.41 1.576-.41 1.83.61.611 1.29.611 1.833.611A1.83 1.83 0 0 0 10.922 8z' }),
        React.createElement("path", { fill: '#252526', d: 'M17.5 4.944h2.445L17.5 2.5h-1.222zm-11 0H4.056L6.5 2.5h1.222zm11 6.112h2.445L17.5 13.5h-1.222zm-11 0H4.056L6.5 13.5h1.222z' }))));
const ForwardRef = forwardRef(FlagSouthKoreaIcon);
export default ForwardRef;
