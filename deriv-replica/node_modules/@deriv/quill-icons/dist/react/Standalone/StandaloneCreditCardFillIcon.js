import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneCreditCardFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.75 7.75h17.5c1.367 0 2.5 1.133 2.5 2.5v1.25H5.25v-1.25c0-1.367 1.094-2.5 2.5-2.5m20 7.5v7.5c0 1.406-1.133 2.5-2.5 2.5H7.75a2.47 2.47 0 0 1-2.5-2.5v-7.5zm-18.125 5a.64.64 0 0 0-.625.625c0 .352.273.625.625.625h2.5a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625zm4.375.625c0 .352.273.625.625.625h5a.64.64 0 0 0 .625-.625c0-.312-.312-.625-.625-.625h-5a.64.64 0 0 0-.625.625' })));
const ForwardRef = forwardRef(StandaloneCreditCardFillIcon);
export default ForwardRef;
