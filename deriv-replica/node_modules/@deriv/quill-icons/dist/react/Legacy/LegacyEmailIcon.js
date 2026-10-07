import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const LegacyEmailIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 16 16', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fillRule: 'evenodd', d: 'M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3zm-.454 1.29A.5.5 0 0 1 2.5 4h11a.5.5 0 0 1 .454.29l-5.65 4.345a.5.5 0 0 1-.609 0zM2 5.514v4.963l3.208-2.495zM2.5 12a.5.5 0 0 1-.454-.29l3.98-3.097 1.06.814a1.5 1.5 0 0 0 1.828 0l1.06-.814 3.98 3.096A.5.5 0 0 1 13.5 12zM14 10.478V5.515l-3.208 2.468z', clipRule: 'evenodd' })));
const ForwardRef = forwardRef(LegacyEmailIcon);
export default ForwardRef;
