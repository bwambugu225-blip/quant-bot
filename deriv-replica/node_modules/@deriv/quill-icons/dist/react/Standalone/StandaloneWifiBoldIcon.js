import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneWifiBoldIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M5.023 13.766c-.39.351-.976.312-1.289-.079a.933.933 0 0 1 .079-1.328C7.055 9.508 11.313 7.75 16 7.75c4.648 0 8.906 1.758 12.148 4.61.391.35.43.937.118 1.328a.933.933 0 0 1-1.328.078A16.5 16.5 0 0 0 16 9.625a16.53 16.53 0 0 0-10.977 4.14M16 16.5c-2.54 0-4.844.977-6.562 2.578A.933.933 0 0 1 8.108 19a.97.97 0 0 1 .04-1.328c2.07-1.875 4.804-3.047 7.851-3.047 3.008 0 5.742 1.172 7.813 3.047.351.351.39.937.039 1.328a.933.933 0 0 1-1.329.078A9.56 9.56 0 0 0 16 16.5m2.188 6.563a2.2 2.2 0 0 1-1.094 1.914c-.703.39-1.524.39-2.188 0-.703-.391-1.094-1.094-1.094-1.915 0-.78.391-1.484 1.094-1.875.664-.39 1.485-.39 2.188 0a2.18 2.18 0 0 1 1.093 1.875' })));
const ForwardRef = forwardRef(StandaloneWifiBoldIcon);
export default ForwardRef;
