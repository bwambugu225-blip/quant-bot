import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneForwardStepRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M19.75 9.625c0-.312.273-.625.625-.625.313 0 .625.313.625.625v13.75a.64.64 0 0 1-.625.625.617.617 0 0 1-.625-.625v-5.273l-6.992 5.664a1.1 1.1 0 0 1-.703.234A1.05 1.05 0 0 1 11 22.945V10.094C11 9.508 11.469 9 12.055 9c.273 0 .508.117.703.273l6.992 5.665zm-7.5.82v12.149l7.422-6.094z' })));
const ForwardRef = forwardRef(StandaloneForwardStepRegularIcon);
export default ForwardRef;
