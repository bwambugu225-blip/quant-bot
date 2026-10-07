import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFileExcelBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M10.875 24c0 .352.273.625.625.625h10a.64.64 0 0 0 .625-.625V12.75H19c-.703 0-1.25-.547-1.25-1.25V8.375H11.5a.64.64 0 0 0-.625.625zM11.5 6.5h6.445c.664 0 1.29.273 1.758.742l3.555 3.555c.469.469.742 1.094.742 1.758V24c0 1.406-1.133 2.5-2.5 2.5h-10A2.47 2.47 0 0 1 9 24V9c0-1.367 1.094-2.5 2.5-2.5m3.516 9.14 1.484 1.837 1.445-1.836a.9.9 0 0 1 1.29-.196c.43.352.507.938.156 1.328L17.67 19l1.759 2.266a.9.9 0 0 1-.196 1.289c-.39.312-.976.273-1.289-.157L16.5 20.563l-1.445 1.835c-.352.43-.938.508-1.328.157-.43-.313-.47-.899-.157-1.29L15.29 19l-1.72-2.227c-.351-.39-.273-.976.157-1.289.39-.351.976-.273 1.289.157' })));
const ForwardRef = forwardRef(StandaloneFileExcelBoldIcon);
export default ForwardRef;
