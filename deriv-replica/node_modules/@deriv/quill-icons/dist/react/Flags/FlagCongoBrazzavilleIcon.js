import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const FlagCongoBrazzavilleIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FBDE4A', d: 'M2 16c-.572 0-1.088-.24-1.453-.626L14 0h8c.572 0 1.088.24 1.453.626L10 16z' }),
    React.createElement("path", { fill: '#009543', d: 'M2 0a2 2 0 0 0-2 2v12c0 .532.208 1.016.547 1.374L14 0z' }),
    React.createElement("path", { fill: '#DC241F', d: 'M10 16h12a2 2 0 0 0 2-2V2c0-.532-.208-1.016-.547-1.374z' }),
    React.createElement("path", { fill: '#000', fillOpacity: 0.08, fillRule: 'evenodd', d: 'M22 1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(FlagCongoBrazzavilleIcon);
export default ForwardRef;
