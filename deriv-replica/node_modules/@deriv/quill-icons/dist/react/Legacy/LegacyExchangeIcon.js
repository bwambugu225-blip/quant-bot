import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyExchangeIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M3.854 7.146a.5.5 0 0 1 0 .708L1.707 10H7.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 0 1 .708 0m9-5 3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L14.292 6H8.5a.5.5 0 0 1 0-1h5.792l-2.146-2.146a.5.5 0 0 1 .708-.708' })));
const ForwardRef = forwardRef(LegacyExchangeIcon);
export default ForwardRef;
