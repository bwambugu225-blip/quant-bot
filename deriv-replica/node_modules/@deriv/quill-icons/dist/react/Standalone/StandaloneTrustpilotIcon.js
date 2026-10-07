import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneTrustpilotIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M20.57 20.602 16 21.812l6.484 4.688zm5.938-6.446L16 21.812 9.477 26.5l2.5-7.617-6.524-4.727H13.5L16 6.5l2.46 7.656z' })));
const ForwardRef = forwardRef(StandaloneTrustpilotIcon);
export default ForwardRef;
