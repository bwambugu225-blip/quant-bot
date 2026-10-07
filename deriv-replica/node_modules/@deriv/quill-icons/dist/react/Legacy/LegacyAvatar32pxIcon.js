import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyAvatar32pxIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("rect", { width: 32, height: 32, fill: '#FF444F', rx: 16 }),
    React.createElement("path", { fill: '#fff', d: 'm13.628 22-1.12-3.296H7.996L6.876 22h-1.36L9.42 10.832h1.712L15.036 22zm-3.344-9.92h-.08l-1.888 5.44h3.856zm6.602-1.248h4.592q1.392 0 2.176.784.8.784.8 2.096 0 .624-.176 1.056a2.3 2.3 0 0 1-.448.72q-.27.272-.592.416-.32.128-.592.176v.096q.305.016.672.16.384.143.72.464.336.305.56.8.24.48.24 1.168t-.224 1.28a3 3 0 0 1-.592 1.024 2.9 2.9 0 0 1-.912.688 2.75 2.75 0 0 1-1.152.24h-5.072zm1.344 9.984h3.312q.864 0 1.36-.432.496-.448.496-1.296v-.544q0-.848-.496-1.28-.495-.448-1.36-.448H18.23zm0-5.152h3.088q.801 0 1.248-.4.449-.4.448-1.152v-.544q0-.751-.448-1.152-.447-.4-1.248-.4H18.23z' })));
const ForwardRef = forwardRef(LegacyAvatar32pxIcon);
export default ForwardRef;
