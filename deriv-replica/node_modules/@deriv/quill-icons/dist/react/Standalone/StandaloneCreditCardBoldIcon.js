import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCreditCardBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M25.25 9.625H7.75a.64.64 0 0 0-.625.625v1.25h18.75v-1.25c0-.312-.312-.625-.625-.625m.625 5.625H7.125v7.5c0 .352.273.625.625.625h17.5a.64.64 0 0 0 .625-.625zM7.75 7.75h17.5c1.367 0 2.5 1.133 2.5 2.5v12.5c0 1.406-1.133 2.5-2.5 2.5H7.75a2.47 2.47 0 0 1-2.5-2.5v-12.5c0-1.367 1.094-2.5 2.5-2.5m2.188 11.875h1.874a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937H9.937c-.546 0-.937-.39-.937-.937 0-.508.39-.938.938-.938m5 0h4.374a.95.95 0 0 1 .938.938c0 .546-.43.937-.937.937h-4.375c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938' })));
const ForwardRef = forwardRef(StandaloneCreditCardBoldIcon);
export default ForwardRef;
