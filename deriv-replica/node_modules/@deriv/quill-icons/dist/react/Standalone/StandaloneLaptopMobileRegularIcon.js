import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneLaptopMobileRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M8.5 7.75c-.703 0-1.25.586-1.25 1.25v8.75h10V19H4.79c.233.742.898 1.25 1.679 1.25H17.25v1.25H6.469A2.967 2.967 0 0 1 3.5 18.531c0-.43.313-.781.742-.781H6V9c0-1.367 1.094-2.5 2.5-2.5H21c1.367 0 2.5 1.133 2.5 2.5v1.25h-1.25V9c0-.664-.586-1.25-1.25-1.25zm11.25 5.625v11.25c0 .352.273.625.625.625h6.25a.64.64 0 0 0 .625-.625v-11.25c0-.312-.312-.625-.625-.625h-6.25a.64.64 0 0 0-.625.625m-1.25 0c0-1.016.82-1.875 1.875-1.875h6.25c1.016 0 1.875.86 1.875 1.875v11.25c0 1.055-.86 1.875-1.875 1.875h-6.25a1.85 1.85 0 0 1-1.875-1.875z' })));
const ForwardRef = forwardRef(StandaloneLaptopMobileRegularIcon);
export default ForwardRef;
