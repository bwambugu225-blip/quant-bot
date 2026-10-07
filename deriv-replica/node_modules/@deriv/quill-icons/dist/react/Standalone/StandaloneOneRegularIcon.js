import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneOneRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M16.625 8.375V24h3.75c.313 0 .625.313.625.625a.64.64 0 0 1-.625.625h-8.75a.617.617 0 0 1-.625-.625c0-.312.273-.625.625-.625h3.75V9.547l-2.812 1.875c-.274.195-.665.117-.86-.195-.195-.274-.117-.665.195-.86l3.75-2.5a.7.7 0 0 1 .625-.039c.196.117.352.352.352.547' })));
const ForwardRef = forwardRef(StandaloneOneRegularIcon);
export default ForwardRef;
