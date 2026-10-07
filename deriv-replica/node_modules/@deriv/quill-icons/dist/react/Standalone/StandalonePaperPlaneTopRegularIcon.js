import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePaperPlaneTopRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6.117 9.586a1.31 1.31 0 0 1 .196-1.445 1.33 1.33 0 0 1 1.406-.274l17.5 7.5c.468.195.781.664.781 1.133 0 .508-.312.977-.781 1.172l-17.5 7.5a1.27 1.27 0 0 1-1.407-.313 1.25 1.25 0 0 1-.195-1.406L9.594 16.5zm4.57 7.539L7.25 24l16.016-6.875zm12.579-1.25L7.25 9l3.438 6.875z' })));
const ForwardRef = forwardRef(StandalonePaperPlaneTopRegularIcon);
export default ForwardRef;
