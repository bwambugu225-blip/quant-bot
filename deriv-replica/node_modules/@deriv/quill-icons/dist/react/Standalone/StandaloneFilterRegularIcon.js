import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFilterRegularIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M6 9.313c0-.86.664-1.563 1.523-1.563h16.915c.859 0 1.562.703 1.562 1.563 0 .351-.156.703-.39.976l-7.11 8.633v5.039c0 .703-.625 1.328-1.328 1.328a1.26 1.26 0 0 1-.82-.312l-2.383-1.836a1.22 1.22 0 0 1-.508-.977v-3.242l-7.11-8.633A1.5 1.5 0 0 1 6 9.313M7.523 9c-.156 0-.273.156-.273.313 0 .078 0 .117.04.195l7.304 8.789c.078.117.156.273.156.39v3.477L17.133 24h.039c.039 0 .078 0 .078-.04v-5.273c0-.117.04-.273.117-.39l7.305-8.79c.039-.077.078-.116.078-.194A.336.336 0 0 0 24.438 9z' })));
const ForwardRef = forwardRef(StandaloneFilterRegularIcon);
export default ForwardRef;
