import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMicrophoneFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16 6.5c2.07 0 3.75 1.68 3.75 3.75v6.25a3.751 3.751 0 0 1-7.5 0v-6.25c0-2.07 1.68-3.75 3.75-3.75m-5 8.438V16.5c0 2.773 2.227 5 5 5 2.734 0 5-2.227 5-5v-1.562c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938V16.5c0 3.516-2.617 6.367-5.937 6.836v1.289h1.875a.95.95 0 0 1 .937.938c0 .546-.43.937-.937.937h-5.625c-.547 0-.938-.39-.938-.937 0-.508.39-.938.938-.938h1.874v-1.29A6.88 6.88 0 0 1 9.125 16.5v-1.562c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938' })));
const ForwardRef = forwardRef(StandaloneMicrophoneFillIcon);
export default ForwardRef;
