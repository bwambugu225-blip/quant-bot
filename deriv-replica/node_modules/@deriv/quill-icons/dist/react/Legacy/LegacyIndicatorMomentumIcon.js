import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyIndicatorMomentumIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.084 6.223a.5.5 0 0 1 .823-.014l5 7a.5.5 0 0 1-.814.582L7.514 7.38 5.916 9.776A.5.5 0 0 1 5.5 10h-3a.5.5 0 0 1 0-1h2.732zM7.1 2.2a.5.5 0 0 1 .8 0l6 8a.5.5 0 0 1-.8.6L7.5 3.333 4.9 6.8a.5.5 0 0 1-.4.2h-2a.5.5 0 0 1 0-1h1.75z' })));
const ForwardRef = forwardRef(LegacyIndicatorMomentumIcon);
export default ForwardRef;
