import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const TradeTypesDigitsDiffersIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { fill: '#FF444F', d: 'M26 15.984v2.683h-7.112l2.445 2.446a2.65 2.65 0 0 1 0 3.754l-.008.009L16 19.551l2.997-2.998q.243-.249.414-.553zM10.675 5.791l5.656 5.657a2.667 2.667 0 0 1 0 3.77l-5.656 5.658-.008-.01a2.65 2.65 0 0 1 0-3.751l2.445-2.448L6 14.683V12h7.112l-2.445-2.447a2.65 2.65 0 0 1 0-3.753zm10.649 4a2.65 2.65 0 0 1 .168 3.593l-.159.172-1.6 1.6a2.67 2.67 0 0 0-.588-2.214l-.148-.16-.33-.333z' }),
    React.createElement("path", { fill: '#85ACB0', d: 'M18 22.667v4h-2.667v-4zm0-17.334v4h-2.667v-4z' })));
const ForwardRef = forwardRef(TradeTypesDigitsDiffersIcon);
export default ForwardRef;
