import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTriangleExclamationFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 7.75a1.56 1.56 0 0 1 1.328.781l8.438 14.375c.273.508.273 1.094 0 1.563a1.48 1.48 0 0 1-1.328.781H7.563c-.586 0-1.094-.273-1.368-.781-.273-.469-.273-1.055 0-1.563l8.438-14.375A1.58 1.58 0 0 1 16 7.75m0 5a.925.925 0 0 0-.937.938v4.374c0 .547.39.938.937.938.508 0 .938-.39.938-.937v-4.375A.95.95 0 0 0 16 12.75m1.25 8.75c0-.664-.586-1.25-1.25-1.25-.703 0-1.25.586-1.25 1.25 0 .703.547 1.25 1.25 1.25.664 0 1.25-.547 1.25-1.25' })));
const ForwardRef = forwardRef(StandaloneTriangleExclamationFillIcon);
export default ForwardRef;
