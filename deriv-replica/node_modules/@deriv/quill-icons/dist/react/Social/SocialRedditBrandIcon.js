import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const SocialRedditBrandIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF4500', d: 'M16 32c8.837 0 16-7.163 16-16S24.837 0 16 0 0 7.163 0 16s7.163 16 16 16' }),
    React.createElement("path", { fill: '#fff', d: 'M26.667 16a2.34 2.34 0 0 0-2.34-2.34c-.636 0-1.197.244-1.609.656-1.59-1.142-3.799-1.89-6.231-1.984l1.066-4.996 3.462.73a1.668 1.668 0 0 0 3.331-.075 1.67 1.67 0 0 0-1.665-1.666c-.655 0-1.217.374-1.479.936l-3.873-.824a.47.47 0 0 0-.318.057.46.46 0 0 0-.188.262l-1.178 5.576c-2.49.075-4.716.805-6.326 1.984a2.36 2.36 0 0 0-1.609-.655A2.34 2.34 0 0 0 5.37 16a2.33 2.33 0 0 0 1.386 2.133 4.4 4.4 0 0 0-.057.711c0 3.593 4.174 6.494 9.339 6.494 5.164 0 9.337-2.9 9.337-6.494 0-.243-.018-.467-.056-.692A2.42 2.42 0 0 0 26.667 16m-16 1.666A1.67 1.67 0 0 1 12.332 16a1.67 1.67 0 0 1 1.666 1.666 1.67 1.67 0 0 1-1.666 1.665 1.67 1.67 0 0 1-1.665-1.665m9.3 4.397c-1.141 1.142-3.312 1.217-3.948 1.217s-2.826-.094-3.949-1.217a.44.44 0 0 1 0-.617.44.44 0 0 1 .618 0c.71.71 2.245.973 3.35.973s2.62-.262 3.35-.973a.44.44 0 0 1 .617 0 .48.48 0 0 1-.038.617m-.3-2.732a1.67 1.67 0 0 1-1.665-1.665A1.67 1.67 0 0 1 19.668 16a1.67 1.67 0 0 1 1.665 1.666 1.67 1.67 0 0 1-1.665 1.665' })));
const ForwardRef = forwardRef(SocialRedditBrandIcon);
export default ForwardRef;
