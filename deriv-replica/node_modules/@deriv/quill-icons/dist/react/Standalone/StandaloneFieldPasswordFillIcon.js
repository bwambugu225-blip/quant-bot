import * as React from 'react';
import { forwardRef } from 'react';
import { sizes } from '../../types';
export const StandaloneFieldPasswordFillIcon = ({ iconSize = 'md', title, titleId, ...props }, ref) => (React.createElement("svg", { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 32 32', ...sizes[iconSize], role: 'img', ref: ref, "aria-labelledby": titleId, ...props },
    title ? React.createElement("title", { id: titleId }, title) : null,
    React.createElement("path", { d: 'M7.25 11.5c-.703 0-1.25.586-1.25 1.25v7.5c0 .703.547 1.25 1.25 1.25h17.5c.664 0 1.25-.547 1.25-1.25v-7.5c0-.664-.586-1.25-1.25-1.25zM3.5 12.75C3.5 10.68 5.18 9 7.25 9h17.5c2.07 0 3.75 1.68 3.75 3.75v7.5c0 2.07-1.68 3.75-3.75 3.75H7.25c-2.07 0-3.75-1.68-3.75-3.75zm16.875 7.813c-.547 0-.937-.391-.937-.938v-6.25c0-.508.39-.937.937-.937a.95.95 0 0 1 .938.937v6.25c0 .547-.43.938-.938.938M11.313 16.5c0 .586-.313 1.094-.782 1.367-.508.274-1.094.274-1.562 0-.508-.273-.781-.781-.781-1.367 0-.547.273-1.055.78-1.328.47-.274 1.055-.274 1.563 0 .469.273.781.781.781 1.328m3.75 0c0 .586-.313 1.094-.782 1.367-.508.274-1.094.274-1.562 0-.508-.273-.781-.781-.781-1.367 0-.547.273-1.055.78-1.328.47-.274 1.055-.274 1.563 0 .469.273.781.781.781 1.328m3.75 0c0 .586-.313 1.094-.782 1.367-.508.274-1.093.274-1.562 0-.508-.273-.782-.781-.782-1.367 0-.547.274-1.055.782-1.328.468-.274 1.054-.274 1.562 0 .469.273.782.781.782 1.328' })));
const ForwardRef = forwardRef(StandaloneFieldPasswordFillIcon);
export default ForwardRef;
