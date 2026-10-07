import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyBackward2pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'm13.293 1.293-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L9.414 8l5.293-5.293a1 1 0 0 0-1.414-1.414m-6 0-6 6a1 1 0 0 0 0 1.414l6 6a1 1 0 0 0 1.414-1.414L3.414 8l5.293-5.293a1 1 0 0 0-1.414-1.414' })));
const ForwardRef = forwardRef(LegacyBackward2pxIcon);
export default ForwardRef;
