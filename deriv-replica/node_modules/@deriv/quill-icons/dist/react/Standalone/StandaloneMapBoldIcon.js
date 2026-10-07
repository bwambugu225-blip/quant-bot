import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneMapBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M26.82 7.945c.274.157.43.47.43.742v13.126c0 .39-.273.742-.625.898l-6.562 2.5a.86.86 0 0 1-.625 0l-7.188-2.383L6 25.211a.86.86 0 0 1-.86-.117c-.273-.157-.39-.469-.39-.782V11.188c0-.39.234-.703.586-.859l6.562-2.5a.86.86 0 0 1 .625 0l7.188 2.383 6.25-2.383a.86.86 0 0 1 .86.117M6.625 11.852v11.132l4.688-1.797V10.056zm12.188 11.171V11.891l-5.625-1.875v11.132zm1.875-.039 4.687-1.797V10.056l-4.687 1.797z' })));
const ForwardRef = forwardRef(StandaloneMapBoldIcon);
export default ForwardRef;
