import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneArrowLeftToLineBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 23.063V9.938c0-.508.39-.938.938-.938a.95.95 0 0 1 .937.938v13.125c0 .546-.43.937-.937.937-.547 0-.938-.39-.938-.937m5.273-7.227 5.313-5c.39-.352.977-.352 1.328.039s.352.977-.039 1.328l-3.594 3.36h8.281a.95.95 0 0 1 .938.937c0 .547-.43.938-.937.938H15.53l3.594 3.398c.39.352.39.937.04 1.328-.352.39-.938.39-1.33.04l-5.312-5c-.195-.196-.273-.43-.273-.704 0-.234.078-.508.273-.664' })));
const ForwardRef = forwardRef(StandaloneArrowLeftToLineBoldIcon);
export default ForwardRef;
