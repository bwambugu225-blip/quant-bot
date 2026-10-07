import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyTemplatesIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 24 24', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M21.5 2a.5.5 0 0 1 .5.5v19a.5.5 0 0 1-.5.5h-19a.5.5 0 0 1-.5-.5v-19a.5.5 0 0 1 .5-.5zM7 18H3v3h4zm14 0H8v3h13zM7 14H3v3h4zm14 0H8v3h13zm0-11H3v10h18zm-3.89 2.188a.5.5 0 1 1 .78.624l-4 5a.5.5 0 0 1-.79-.012l-2.654-3.539-3.592 3.593a.5.5 0 0 1-.708-.708l4-4a.5.5 0 0 1 .754.054l2.613 3.484z' })));
const ForwardRef = forwardRef(LegacyTemplatesIcon);
export default ForwardRef;
