import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyIndicatorAveragesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M2.494 10.575c.026-.172.088-.484.19-.89.173-.675.4-1.35.689-1.976C4.164 5.992 5.235 5 6.62 5c1.507 0 2.034.756 2.75 3.275l.103.363C10.355 11.71 11.373 13 14 13a.5.5 0 0 0 0-1c-2.046 0-2.794-.947-3.566-3.638l-.102-.36C9.502 5.084 8.747 4 6.62 4 4.759 4 3.401 5.258 2.465 7.29a12.6 12.6 0 0 0-.75 2.15 13 13 0 0 0-.21.985.5.5 0 0 0 .99.15' })));
const ForwardRef = forwardRef(LegacyIndicatorAveragesIcon);
export default ForwardRef;
