import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyArrowUp1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8 2a.5.5 0 0 1 .191.038.5.5 0 0 1 .163.108l-.052-.044q.02.014.04.033l.012.011 3.5 3.5a.5.5 0 0 1-.708.708L8.5 3.707V13.5a.5.5 0 0 1-.41.492L8 14a.5.5 0 0 1-.5-.5V3.707L4.854 6.354a.5.5 0 0 1-.638.057l-.07-.057a.5.5 0 0 1 0-.708l3.5-3.5A.5.5 0 0 1 8 2l-.074.005L7.99 2z' })));
const ForwardRef = forwardRef(LegacyArrowUp1pxIcon);
export default ForwardRef;
