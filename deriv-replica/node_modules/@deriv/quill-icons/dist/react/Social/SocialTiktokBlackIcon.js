import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const SocialTiktokBlackIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#000', d: 'M25.785 6.414A7.67 7.67 0 0 1 22.299 0h-5.501l-.01 22.048a4.627 4.627 0 0 1-4.615 4.451 4.6 4.6 0 0 1-2.145-.531 4.63 4.63 0 0 1-2.48-4.093 4.63 4.63 0 0 1 4.625-4.625c.476 0 .932.078 1.365.214v-5.617c-.447-.06-.901-.098-1.365-.098-5.583 0-10.126 4.543-10.126 10.126 0 3.426 1.711 6.458 4.322 8.29A10.07 10.07 0 0 0 12.173 32c5.583 0 10.126-4.542 10.126-10.126v-11.18a13.1 13.1 0 0 0 7.655 2.461V7.653a7.6 7.6 0 0 1-4.168-1.24z' })));
const ForwardRef = forwardRef(SocialTiktokBlackIcon);
export default ForwardRef;
