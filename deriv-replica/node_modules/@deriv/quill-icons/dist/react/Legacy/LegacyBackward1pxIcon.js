import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBackward1pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm8.13 2.164-5 5.5a.5.5 0 0 0 0 .672l5 5.5a.5.5 0 1 0 .74-.672L4.176 8 8.87 2.836a.5.5 0 0 0-.74-.672m5 0-5 5.5a.5.5 0 0 0 0 .672l5 5.5a.5.5 0 1 0 .74-.672L9.176 8l4.694-5.164a.5.5 0 0 0-.74-.672' })));
const ForwardRef = forwardRef(LegacyBackward1pxIcon);
export default ForwardRef;
