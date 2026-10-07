import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneRectangleBarcodeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 7.75h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.25a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5m2.188 3.75a.925.925 0 0 0-.938.938v8.124c0 .547.39.938.938.938.507 0 .937-.39.937-.937v-8.125a.95.95 0 0 0-.937-.938m2.187.625v8.75c0 .352.273.625.625.625a.64.64 0 0 0 .625-.625v-8.75c0-.312-.312-.625-.625-.625a.64.64 0 0 0-.625.625m3.438-.625a.925.925 0 0 0-.938.938v8.124c0 .547.39.938.938.938.507 0 .937-.39.937-.937v-8.125a.95.95 0 0 0-.937-.938m3.437.938v8.124c0 .547.39.938.938.938.507 0 .937-.39.937-.937v-8.125a.95.95 0 0 0-.937-.938.925.925 0 0 0-.938.938m4.375-.938a.64.64 0 0 0-.625.625v8.75c0 .352.273.625.625.625a.64.64 0 0 0 .625-.625v-8.75c0-.312-.312-.625-.625-.625' })));
const ForwardRef = forwardRef(StandaloneRectangleBarcodeFillIcon);
export default ForwardRef;
