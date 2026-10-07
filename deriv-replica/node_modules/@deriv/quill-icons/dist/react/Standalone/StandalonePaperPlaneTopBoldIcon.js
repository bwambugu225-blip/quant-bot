import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandalonePaperPlaneTopBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M11.195 15.563h9.766L8.539 10.25zm0 1.874L8.54 22.79l12.422-5.352zM7.72 7.868l17.5 7.5c.468.195.781.664.781 1.172 0 .469-.312.938-.781 1.133l-17.5 7.5a1.27 1.27 0 0 1-1.407-.313c-.351-.351-.43-.937-.195-1.406L9.594 16.5 6.117 9.586a1.31 1.31 0 0 1 .196-1.445 1.33 1.33 0 0 1 1.406-.274' })));
const ForwardRef = forwardRef(StandalonePaperPlaneTopBoldIcon);
export default ForwardRef;
