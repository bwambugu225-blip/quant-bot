import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneSortBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M12.484 13.375h6.993L16 9.898zm4.375-5.234 5 5c.352.351.47.898.274 1.367a1.28 1.28 0 0 1-1.172.781H11a1.28 1.28 0 0 1-1.172-.781 1.26 1.26 0 0 1 .274-1.367l5-5a1.205 1.205 0 0 1 1.757 0m-4.375 11.484L16 23.141l3.477-3.516zm4.375 5.273a1.205 1.205 0 0 1-1.757 0l-5-5a1.26 1.26 0 0 1-.274-1.367A1.28 1.28 0 0 1 11 17.75h10c.469 0 .938.313 1.133.781a1.26 1.26 0 0 1-.274 1.367z' })));
const ForwardRef = forwardRef(StandaloneSortBoldIcon);
export default ForwardRef;
