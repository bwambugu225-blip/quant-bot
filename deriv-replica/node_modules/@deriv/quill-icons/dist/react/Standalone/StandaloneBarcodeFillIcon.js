import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneBarcodeFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6.938 7.75h.625a.95.95 0 0 1 .937.938v15.625c0 .546-.43.937-.937.937h-.625c-.547 0-.938-.39-.938-.937V8.688c0-.508.39-.938.938-.938m3.437 0c.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625V8.375c0-.312.273-.625.625-.625m2.813 0h.624a.95.95 0 0 1 .938.938v15.625c0 .546-.43.937-.937.937h-.626c-.546 0-.937-.39-.937-.937V8.688c0-.508.39-.938.938-.938m3.75 0h.625a.95.95 0 0 1 .937.938v15.625c0 .546-.43.937-.937.937h-.625c-.547 0-.938-.39-.938-.937V8.688c0-.508.39-.938.938-.938m6.562.938c0-.508.39-.938.938-.938h.625a.95.95 0 0 1 .937.938v15.625c0 .546-.43.937-.937.937h-.625c-.547 0-.938-.39-.938-.937zM21 8.375c0-.312.273-.625.625-.625.313 0 .625.313.625.625v16.25a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625z' })));
const ForwardRef = forwardRef(StandaloneBarcodeFillIcon);
export default ForwardRef;
